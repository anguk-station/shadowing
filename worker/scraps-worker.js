/* ============================================================
   Cloudflare Worker — 영어 쉐도잉 사이트 스크랩 저장소 (KV)
   문장 암기장(english 워커)과는 따로 쓰는 전용 워커.
   사이트(anguk-station.github.io/shadowing)의 sync.js가 호출해요.

   [배포 방법 — 대시보드, CLI 불필요]
   1. Workers & Pages → Create → Worker → 이름 "shadowing" → Deploy
   2. 그 워커 → Edit code 에 이 파일 내용 전체 붙여넣고 Deploy
   3. Storage & databases → KV → Create namespace (이름 예: shadowing_scraps)
   4. 워커 → Settings → Bindings → Add → KV namespace
      - Variable name: SCRAPS   (반드시 대문자 SCRAPS)
      - KV namespace: 위에서 만든 shadowing_scraps → Deploy
   5. https://shadowing.<계정>.workers.dev/health 에서 "ok scraps kv:on" 확인

   라우팅:
   - GET  /health  → 배포 확인
   - GET  /scraps  → 스크랩 전체 { "영상id:문장번호": {...} }
   - POST /scraps  → { items: {...} } 를 서버 쪽과 합쳐 저장(항목마다 upd가 최근인 쪽), 합친 결과 반환
                     지운 스크랩은 {del:true, upd}로 들어와서 다른 기기에서도 지워짐
   ============================================================ */

const ALLOWED_ORIGINS = [
  "https://anguk-station.github.io", // GitHub Pages (영어 쉐도잉 사이트)
];
const KEY = "scraps"; // KV 안에 모든 스크랩을 담는 단일 키

// 허용: 위 목록 + 로컬 테스트(localhost, 127.0.0.1 모든 포트)
function isAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try { const h = new URL(origin).hostname; return h === "localhost" || h === "127.0.0.1"; } catch (e) { return false; }
}
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": isAllowed(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}
function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders(origin), "content-type": "application/json" } });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response("ok scraps kv:" + (env.SCRAPS ? "on" : "off"), { status: 200, headers: corsHeaders(origin) });
    }
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (!isAllowed(origin)) return new Response("Forbidden origin: " + origin, { status: 403, headers: corsHeaders(origin) });

    if (url.pathname === "/scraps") {
      if (!env.SCRAPS) return json({ error: "KV binding 'SCRAPS' 가 설정되지 않았어요." }, 500, origin);
      const stored = await env.SCRAPS.get(KEY);
      const all = stored ? JSON.parse(stored) : {};
      if (request.method === "GET") return json(all, 200, origin);
      if (request.method === "POST") {
        let payload;
        try { payload = await request.json(); } catch (e) { return json({ error: "invalid JSON" }, 400, origin); }
        const items = payload && payload.items;
        if (!items || typeof items !== "object") return json({ error: "items required" }, 400, origin);
        const updOf = v => (v && (v.upd || v.at)) || 0;
        let changed = false;
        for (const k in items) {
          if (!all[k] || updOf(items[k]) > updOf(all[k])) { all[k] = items[k]; changed = true; }
        }
        if (changed) await env.SCRAPS.put(KEY, JSON.stringify(all));
        return json(all, 200, origin);
      }
      return json({ error: "method not allowed" }, 405, origin);
    }
    return new Response("Not Found", { status: 404, headers: corsHeaders(origin) });
  },
};
