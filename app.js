(() => {
  'use strict';

  const DOMAINS = {
    D1:['Security Concepts and Practices','questions/d1.json'],
    D2:['Access Controls','questions/d2.json'],
    D3:['Risk Identification, Monitoring and Analysis','questions/d3.json'],
    D4:['Incident Response and Recovery','questions/d4.json'],
    D5:['Cryptography','questions/d5.json'],
    D6:['Network and Communications Security','questions/d6.json'],
    D7:['Systems and Application Security','questions/d7.json']
  };
  const EXAMS = {
    mockA:['Mock A','本番相当・100問','questions/mockA.json',120],
    mockB:['Mock B','本番より難しめ・100問','questions/mockB.json',120],
    challenge:['Challenge','難問・ひっかけ・30問','questions/challenge.json',0]
  };
  const SETS = {
    ...Object.fromEntries(Object.entries(DOMAINS).map(([k,v])=>[k,{label:k,sub:v[0],file:v[1],time:0}])),
    ...Object.fromEntries(Object.entries(EXAMS).map(([k,v])=>[k,{label:v[0],sub:v[1],file:v[2],time:v[3]}]))
  };
  const state={key:null,qs:[],i:0,answers:[],submitted:[],flags:[],deadline:null,timer:null,error:''};
  const content=document.getElementById('content-area')||document.getElementById('app')||document.querySelector('main')||document.body;
  const nav=document.getElementById('category-list');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function styles(){
    if(document.getElementById('sscp-runtime-style'))return;
    const s=document.createElement('style');s.id='sscp-runtime-style';s.textContent=`
      :root{--snavy:#082d4d;--sblue:#08769a;--scyan:#19aeb8;--sline:#d7e1e8;--sbg:#f3f6f8;--sok:#16855b;--sbad:#c6414e;--smuted:#65778a}
      .sscp-wrap{max-width:1040px;margin:0 auto;padding:16px}.sscp-hero{text-align:center;margin:20px auto 28px}.sscp-hero h2{font-size:clamp(1.8rem,4vw,2.7rem);color:var(--snavy);margin:0 0 10px}.sscp-hero p{color:var(--smuted)}
      .sscp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}.sscp-set{background:#fff;border:1px solid var(--sline);border-top:5px solid var(--scyan);border-radius:15px;padding:24px;text-align:left;cursor:pointer;box-shadow:0 9px 25px #16354b14}.sscp-set:hover{transform:translateY(-2px)}.sscp-set h3{font-size:1.3rem;color:var(--snavy);margin:7px 0}.sscp-set p{color:var(--smuted)}.sscp-tag{background:#e6f6f7;color:#057280;border-radius:99px;padding:5px 10px;font-size:.76rem;font-weight:800}
      #category-list{display:grid;gap:7px}.sscp-domain{width:100%;display:grid;grid-template-columns:38px 1fr;gap:9px;align-items:center;text-align:left;border:1px solid transparent;border-radius:10px;padding:9px;background:transparent;color:#dcecf5;cursor:pointer}.sscp-domain:hover,.sscp-domain.active{background:#173f5d;border-color:#2b627f}.sscp-dcode{display:grid;place-items:center;height:31px;border-radius:8px;background:#0b536e;color:#72e2e6;font-weight:800}.sscp-dname{font-size:.72rem;line-height:1.25}
      .sscp-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}.sscp-progress-box{flex:1}.sscp-progress{height:9px;background:#dce6eb;border-radius:99px;overflow:hidden}.sscp-progress span{display:block;height:100%;background:linear-gradient(90deg,var(--sblue),var(--scyan))}.sscp-small{font-size:.84rem;color:var(--smuted);margin-top:5px}.sscp-timer{font-weight:800;color:var(--snavy);background:#fff;border:1px solid var(--sline);padding:9px 13px;border-radius:9px}.sscp-timer.warn{color:var(--sbad)}
      .sscp-card{background:#fff;border:1px solid var(--sline);border-radius:16px;overflow:hidden;box-shadow:0 8px 28px #15354d14}.sscp-qhead{padding:25px 32px;background:linear-gradient(130deg,var(--snavy),#0b5071);color:#fff}.sscp-meta{font-size:.77rem;opacity:.86;margin-bottom:12px}.sscp-question{font-size:1.18rem;line-height:1.85;font-weight:650}.sscp-body{padding:28px 32px}.sscp-options{display:grid;gap:14px}.sscp-option{display:grid;grid-template-columns:44px 1fr;align-items:center;width:100%;min-height:62px;padding:15px 17px;border:2px solid var(--sline);border-radius:11px;background:#fff;text-align:left;font-family:inherit;font-size:1.05rem;font-weight:500;line-height:1.7;color:#172433;cursor:pointer}.sscp-option:hover:not(:disabled),.sscp-option.sel{border-color:var(--sblue);background:#edf7fa}.sscp-option.good{border-color:var(--sok);background:#edf8f3}.sscp-option.bad{border-color:var(--sbad);background:#fff0f2}.sscp-letter{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#e8eef2;color:var(--snavy);font-size:1rem;font-weight:800}.good .sscp-letter{background:var(--sok);color:#fff}.bad .sscp-letter{background:var(--sbad);color:#fff}.sscp-feedback{margin-top:20px;padding:18px;border-left:5px solid;border-radius:10px;font-size:1rem;line-height:1.8}.sscp-feedback.good{background:#edf8f3;border-color:var(--sok)}.sscp-feedback.bad{background:#fff0f2;border-color:var(--sbad)}
      .sscp-actions{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:20px}.sscp-group{display:flex;gap:9px}.sscp-btn{border:0;border-radius:9px;padding:11px 17px;font-weight:750;cursor:pointer}.sscp-btn:disabled{opacity:.4}.sscp-primary{background:var(--sblue);color:#fff}.sscp-secondary{background:#e7edf1;color:var(--snavy)}.sscp-flag{background:#fff1cf;color:#785000}.sscp-error{padding:17px;background:#fff0f2;border:1px solid #efa8af;border-radius:10px;color:#8c2832;margin-bottom:18px}
      .sscp-result{text-align:center;padding:35px}.sscp-score{font-size:5rem;line-height:1;font-weight:850;color:var(--snavy)}.sscp-score small{font-size:1.2rem}.sscp-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:11px;margin:24px 0;text-align:left}.sscp-stat{background:#f4f7f9;border:1px solid var(--sline);padding:13px;border-radius:9px}.sscp-stat strong{display:block;font-size:1.35rem;color:var(--snavy)}.sscp-review{text-align:left;margin-top:25px}.sscp-row{padding:12px;margin:7px 0;border:1px solid var(--sline);border-left:5px solid;border-radius:8px;cursor:pointer}.sscp-row.good{border-left-color:var(--sok)}.sscp-row.bad{border-left-color:var(--sbad)}
      @media(max-width:620px){.sscp-wrap{padding:8px}.sscp-qhead{padding:19px 16px}.sscp-body{padding:16px 12px}.sscp-actions,.sscp-group{width:100%}.sscp-group .sscp-btn{flex:1}.sscp-question{font-size:1.08rem;line-height:1.8}.sscp-options{gap:12px}.sscp-option{grid-template-columns:43px 1fr;min-height:68px;padding:15px 13px;font-size:1.08rem;font-weight:550;line-height:1.72}.sscp-letter{width:33px;height:33px;font-size:1.02rem}.sscp-feedback{font-size:1.02rem;line-height:1.8;padding:16px 14px}.sscp-small{font-size:.9rem;line-height:1.55}}
    `;document.head.appendChild(s);
  }

  function renderNav(){
    if(!nav)return;
    nav.innerHTML=Object.entries(DOMAINS).map(([k,v])=>`<button class="sscp-domain ${state.key===k?'active':''}" data-domain="${k}"><span class="sscp-dcode">${k}</span><span class="sscp-dname">${esc(v[0])}</span></button>`).join('');
    nav.querySelectorAll('[data-domain]').forEach(b=>b.onclick=()=>load(b.dataset.domain));
  }

  function home(){
    clearTimer();state.key=null;renderNav();
    const error=state.error?`<div class="sscp-error"><strong>読み込みエラー</strong><br>${esc(state.error)}<br><small>対象JSONが questions/ にあるか確認してください。</small></div>`:'';
    const cards=Object.entries(EXAMS).map(([k,v])=>`<button class="sscp-set" data-set="${k}"><span class="sscp-tag">${k==='challenge'?'30':'100'} QUESTIONS</span><h3>${esc(v[0])}</h3><p>${esc(v[1])}</p><strong>開始する →</strong></button>`).join('');
    content.innerHTML=`<div class="sscp-wrap">${error}<div class="sscp-hero"><h2>SSCP Practice Exams</h2><p>左のドメイン別演習、または本番形式のセットを選択してください。</p></div><div class="sscp-grid">${cards}</div></div>`;
    content.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>load(b.dataset.set));
  }

  async function load(key){
    const set=SETS[key];if(!set)return;state.error='';state.key=key;renderNav();
    content.innerHTML='<div class="sscp-wrap"><div class="sscp-card sscp-result"><h2>問題を読み込んでいます…</h2></div></div>';
    try{
      const r=await fetch(set.file,{cache:'no-store'});if(!r.ok)throw new Error(`${set.file}（HTTP ${r.status}）`);
      const data=await r.json();validate(data,set.file);state.qs=data;state.i=0;state.answers=Array(data.length).fill(null);state.submitted=Array(data.length).fill(false);state.flags=Array(data.length).fill(false);state.deadline=set.time?Date.now()+set.time*60000:null;
      if(state.deadline)state.timer=setInterval(updateTimer,1000);quiz();
    }catch(e){state.error=e.message;home();}
  }

  function validate(data,file){
    if(!Array.isArray(data)||!data.length)throw new Error(`${file} に問題がありません`);
    const ids=new Set();for(const q of data){if(!q.id||ids.has(q.id)||!q.question||!Array.isArray(q.options)||q.options.length!==4||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3)throw new Error(`${file}: 問題形式が不正です`);ids.add(q.id);}
  }

  function quiz(){
    const q=state.qs[state.i],selected=state.answers[state.i],done=state.submitted[state.i];
    const opts=q.options.map((x,i)=>{let c='sscp-option';if(selected===i)c+=' sel';if(done&&i===q.correctIndex)c+=' good';if(done&&selected===i&&i!==q.correctIndex)c+=' bad';return `<button class="${c}" data-opt="${i}" ${done?'disabled':''}><span class="sscp-letter">${'ABCD'[i]}</span><span>${esc(x)}</span></button>`}).join('');
    const feedback=done?`<div class="sscp-feedback ${selected===q.correctIndex?'good':'bad'}"><strong>${selected===q.correctIndex?'✓ 正解':'✕ 不正解'} — 正解 ${'ABCD'[q.correctIndex]}</strong><br>${esc(q.rationale||q.explanation||'')}${q.hint?`<div class="sscp-small"><b>試験ヒント：</b>${esc(q.hint)}</div>`:''}</div>`:'';
    content.innerHTML=`<div class="sscp-wrap"><div class="sscp-top"><div class="sscp-progress-box"><div class="sscp-progress"><span style="width:${(state.i+1)/state.qs.length*100}%"></span></div><div class="sscp-small">問題 ${state.i+1} / ${state.qs.length}・解答済み ${state.submitted.filter(Boolean).length}</div></div>${state.deadline?'<div id="sscp-timer" class="sscp-timer">--:--</div>':''}</div><article class="sscp-card"><div class="sscp-qhead"><div class="sscp-meta">${esc(q.id)}　|　${esc(q.domain)}　|　${esc(q.objective||'')}</div><div class="sscp-question">${esc(q.question)}</div></div><div class="sscp-body"><div class="sscp-options">${opts}</div>${feedback}<div class="sscp-actions"><div class="sscp-group"><button class="sscp-btn sscp-secondary" data-act="home">セット選択</button><button class="sscp-btn sscp-flag" data-act="flag">${state.flags[state.i]?'★ 見直し対象':'☆ 見直す'}</button></div><div class="sscp-group"><button class="sscp-btn sscp-secondary" data-act="prev" ${state.i===0?'disabled':''}>前へ</button>${done?`<button class="sscp-btn sscp-primary" data-act="next">${state.i===state.qs.length-1?'結果を見る':'次の問題へ'}</button>`:`<button class="sscp-btn sscp-primary" data-act="submit" ${selected===null?'disabled':''}>解答を確定</button>`}</div></div></div></article></div>`;
    content.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>{state.answers[state.i]=+b.dataset.opt;quiz()});
    content.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>action(b.dataset.act));updateTimer();
  }

  function action(a){
    if(a==='home'){if(confirm('現在の演習を終了しますか？'))home()}
    if(a==='flag'){state.flags[state.i]=!state.flags[state.i];quiz()}
    if(a==='prev'){state.i--;quiz()}
    if(a==='submit'&&state.answers[state.i]!==null){state.submitted[state.i]=true;quiz()}
    if(a==='next'){if(state.i<state.qs.length-1){state.i++;quiz()}else finish()}
  }

  function finish(force=false){
    if(!force){const n=state.submitted.filter(x=>!x).length;if(n&&!confirm(`未確定が ${n} 問あります。結果を表示しますか？`))return}
    clearTimer();const total=state.qs.length,correct=state.qs.reduce((n,q,i)=>n+(state.submitted[i]&&state.answers[i]===q.correctIndex),0),rate=Math.round(correct/total*100),ds={};
    state.qs.forEach((q,i)=>{const d=ds[q.domain]??={n:0,c:0};d.n++;if(state.submitted[i]&&state.answers[i]===q.correctIndex)d.c++});
    const stats=Object.entries(ds).map(([k,d])=>`<div class="sscp-stat"><span>${k}</span><strong>${Math.round(d.c/d.n*100)}%</strong><small>${d.c}/${d.n}</small></div>`).join('');
    const rows=state.qs.map((q,i)=>{const ok=state.submitted[i]&&state.answers[i]===q.correctIndex;return `<div class="sscp-row ${ok?'good':'bad'}" data-review="${i}"><b>${esc(q.id)} ${ok?'✓':'✕'}</b> ${esc(q.question)}</div>`}).join('');
    content.innerHTML=`<div class="sscp-wrap"><div class="sscp-card sscp-result"><h2>${esc(SETS[state.key].label)} 結果</h2><div class="sscp-score">${rate}<small>%</small></div><p>${correct} / ${total} 問正解</p><div class="sscp-stats">${stats}</div><div class="sscp-group" style="justify-content:center"><button class="sscp-btn sscp-primary" data-result="retry">再挑戦</button><button class="sscp-btn sscp-secondary" data-result="home">セット選択</button></div><div class="sscp-review"><h3>問題別レビュー</h3>${rows}</div></div></div>`;
    content.querySelector('[data-result="retry"]').onclick=()=>load(state.key);content.querySelector('[data-result="home"]').onclick=home;content.querySelectorAll('[data-review]').forEach(b=>b.onclick=()=>{state.i=+b.dataset.review;quiz()});
  }

  function updateTimer(){if(!state.deadline)return;const ms=Math.max(0,state.deadline-Date.now()),el=document.getElementById('sscp-timer');if(el){el.textContent=`${String(Math.floor(ms/60000)).padStart(2,'0')}:${String(Math.floor(ms%60000/1000)).padStart(2,'0')}`;el.classList.toggle('warn',ms<=600000)}if(ms===0&&state.qs.length)finish(true)}
  function clearTimer(){if(state.timer)clearInterval(state.timer);state.timer=null;state.deadline=null}

  styles();renderNav();home();
})();
