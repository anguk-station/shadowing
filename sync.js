/* 스크랩 저장소 + GitHub Gist 동기화 (index.html, scrap.html 공용)
   - 스크랩은 이 기기 localStorage("sh-scraps")에 저장: { "영상id:문장번호": {id,n,en,ko,t,at,memo,upd} }
   - 지운 스크랩은 {del:true,upd}로 남겨서 다른 기기에서 되살아나지 않게 함
   - 토큰(gist 권한)을 넣으면 비공개 gist "scraps.json"과 합쳐서(더 최근 upd가 이김) 양쪽을 같게 맞춤
   - 토큰은 이 기기 브라우저에만 저장되고 사이트 코드나 저장소에는 들어가지 않음 */
(function(){
const LS={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const KEY="sh-scraps", TOK="sh-gh-token", GID="sh-gh-gist", FILE="scraps.json", DESC="shadowing-scraps (영어 쉐도잉 스크랩)";
const raw=()=>{try{return JSON.parse(LS.get(KEY))||{}}catch(e){return {}}};
const saveRaw=o=>LS.set(KEY,JSON.stringify(o));
const updOf=v=>(v&&(v.upd||v.at))||0;
const sorted=o=>JSON.stringify(Object.keys(o).sort().map(k=>[k,o[k]]));

const Scraps={
  all(){const r=raw(),o={};for(const k in r) if(!r[k].del) o[k]=r[k];return o;},
  count(){return Object.keys(this.all()).length},
  has(k){const v=raw()[k];return !!v&&!v.del},
  put(k,v){const r=raw();r[k]=Object.assign({},v,{upd:Date.now()});saveRaw(r);Sync.later();},
  remove(k){const r=raw();if(r[k]&&!r[k].del){r[k]={del:true,upd:Date.now()};saveRaw(r);Sync.later();}},
  setMemo(k,m){const r=raw();if(r[k]&&!r[k].del){r[k].memo=m;r[k].upd=Date.now();saveRaw(r);Sync.later();}},
  /* 다른 곳(gist·백업)의 데이터와 합침. 키마다 upd가 더 최근인 쪽을 씀. 바뀐 게 있으면 true */
  merge(inc){const r=raw();let ch=false;for(const k in inc){if(!r[k]||updOf(inc[k])>updOf(r[k])){r[k]=inc[k];ch=true;}}if(ch) saveRaw(r);return ch;},
  raw
};

function api(path,opt){opt=opt||{};
  return fetch("https://api.github.com"+path,{method:opt.method||"GET",body:opt.body,cache:"no-store",
    headers:Object.assign({"Authorization":"Bearer "+LS.get(TOK),"Accept":"application/vnd.github+json"},opt.body?{"Content-Type":"application/json"}:{})})
  .then(async r=>{if(!r.ok){const t=await r.text();throw new Error(r.status+(r.status===401?" 토큰이 올바르지 않거나 만료됐어요":r.status===404?" gist를 찾지 못했어요 (토큰에 gist 권한이 있는지 확인)":" "+t.slice(0,100)));}return r.status===204?null:r.json();});
}

const Sync={
  status:"", listeners:[],
  on(){return !!LS.get(TOK)},
  onStatus(f){this.listeners.push(f);f(this.status);},
  emit(s){this.status=s;this.listeners.forEach(f=>f(s));},
  async gistId(){
    let id=LS.get(GID); if(id) return id;
    for(let p=1;p<=5;p++){ const list=await api("/gists?per_page=100&page="+p);
      const g=list.find(g=>g.files&&g.files[FILE]&&(g.description||"").startsWith("shadowing-scraps"));
      if(g){LS.set(GID,g.id);return g.id;} if(list.length<100) break; }
    const g=await api("/gists",{method:"POST",body:JSON.stringify({description:DESC,public:false,files:{[FILE]:{content:JSON.stringify(raw())}}})});
    LS.set(GID,g.id); return g.id;
  },
  async pull(){ const g=await api("/gists/"+await this.gistId()); const f=g.files&&g.files[FILE];
    let txt=f?f.content:"{}"; if(f&&f.truncated) txt=await fetch(f.raw_url,{cache:"no-store"}).then(r=>r.text());
    try{return JSON.parse(txt)||{}}catch(e){return {}} },
  /* 받아서 합치고, 내 쪽이 다르면 올림. 화면을 다시 그려야 하면 true */
  async run(){
    if(!this.on()) return false;
    if(this.busy){this.again=true;return false;}
    this.busy=true; this.emit("동기화 중…");
    try{
      const rem=await this.pull(); const changed=Scraps.merge(rem); const loc=raw();
      if(sorted(loc)!==sorted(rem)) await api("/gists/"+LS.get(GID),{method:"PATCH",body:JSON.stringify({files:{[FILE]:{content:JSON.stringify(loc)}}})});
      this.emit("동기화됨 · "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"}));
      this.busy=false; if(this.again){this.again=false;return (await this.run())||changed;} return changed;
    }catch(e){ this.busy=false; this.again=false; if(/^404/.test(e.message)) LS.del(GID); this.emit("동기화 실패: "+e.message); return false; }
  },
  later(){ if(!this.on()) return; clearTimeout(this._t); this._t=setTimeout(()=>this.run(),1500); },
  connect(token){ LS.set(TOK,token.trim()); LS.del(GID); return this.run(); },
  disconnect(){ LS.del(TOK); LS.del(GID); this.emit(""); }
};
window.Scraps=Scraps; window.Sync=Sync;
})();
