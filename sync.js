/* 스크랩 저장소 + 기기 간 동기화 (index.html, scrap.html 공용)
   - 스크랩은 이 기기 localStorage("sh-scraps")에 저장: { "영상id:문장번호": {id,n,en,ko,t,at,memo,upd} }
   - 지운 스크랩은 {del:true,upd}로 남겨서 다른 기기에서 되살아나지 않게 함
   - 동기화: 문장 암기장 앱과 같은 Cloudflare Worker(english) KV의 "shadowing-scraps" 키에 저장.
     GET /scraps 로 받아 합치고, POST /scraps {items} 로 올리면 서버가 항목별 최신(upd)으로 합쳐서 돌려줌.
     토큰·로그인 없이 자동. 워커가 *.github.io 주소의 요청만 받음 */
(function(){
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const KEY="sh-scraps";
const raw=()=>{try{return JSON.parse(LS.get(KEY))||{}}catch(e){return {}}};
const saveRaw=o=>LS.set(KEY,JSON.stringify(o));
const updOf=v=>(v&&(v.upd||v.at))||0;

const Scraps={
  all(){const r=raw(),o={};for(const k in r) if(!r[k].del) o[k]=r[k];return o;},
  count(){return Object.keys(this.all()).length},
  has(k){const v=raw()[k];return !!v&&!v.del},
  put(k,v){const r=raw();r[k]=Object.assign({},v,{upd:Date.now()});saveRaw(r);Sync.later();},
  remove(k){const r=raw();if(r[k]&&!r[k].del){r[k]={del:true,upd:Date.now()};saveRaw(r);Sync.later();}},
  setMemo(k,m){const r=raw();if(r[k]&&!r[k].del){r[k].memo=m;r[k].upd=Date.now();saveRaw(r);Sync.later();}},
  /* 다른 곳(서버·백업)의 데이터와 합침. 키마다 upd가 더 최근인 쪽을 씀. 바뀐 게 있으면 true */
  merge(inc){const r=raw();let ch=false;for(const k in inc){if(!r[k]||updOf(inc[k])>updOf(r[k])){r[k]=inc[k];ch=true;}}if(ch) saveRaw(r);return ch;},
  raw
};

const SERVER="https://english.onewoo90.workers.dev/scraps";
const Sync={
  status:"", listeners:[],
  on(){return true},
  onStatus(f){this.listeners.push(f);f(this.status);},
  emit(s){this.status=s;this.listeners.forEach(f=>f(s));},
  /* 서버와 합치기: 받아서 합치고, 내 것을 올리면 서버가 합친 결과를 돌려줌. 화면을 다시 그려야 하면 true */
  async run(){
    if(this.busy){this.again=true;return false;}
    this.busy=true; this.emit("동기화 중…");
    try{
      const g=await fetch(SERVER,{cache:"no-store"}); if(!g.ok) throw new Error(g.status===405?"서버 준비 전 (워커 배포 필요)":"서버 응답 "+g.status);
      let changed=Scraps.merge(await g.json());
      const p=await fetch(SERVER,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:raw()})});
      if(!p.ok) throw new Error("저장 실패 "+p.status);
      changed=Scraps.merge(await p.json())||changed;
      this.emit("동기화됨 · "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"}));
      this.busy=false; if(this.again){this.again=false;return (await this.run())||changed;} return changed;
    }catch(e){ this.busy=false; this.again=false; this.emit("동기화 안 됨: "+(e.message||"연결 실패")+" · 이 기기에는 저장돼 있어요"); return false; }
  },
  later(){ clearTimeout(this._t); this._t=setTimeout(()=>this.run(),1200); }
};
window.Scraps=Scraps; window.Sync=Sync;
})();
