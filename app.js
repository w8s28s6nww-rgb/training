(function(){
"use strict";
const PL=window.PLAN, KEY="ohTraining.v1";
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const WD=["So","Mo","Di","Mi","Do","Fr","Sa"], WDL=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
const FL={kg:"kg",wdh:"Wdh.",sek:"Sek.",m:"m",min:"Min.",runden:"Runden"};
// ---------- Datum
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const parse=s=>{const[a,b,c]=s.split("-").map(Number);return new Date(a,b-1,c,12)};
const add=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const diff=(a,b)=>Math.round((parse(a)-parse(b))/864e5);
const fmt=s=>{const d=parse(s);return String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear()};
const fmtS=s=>{const d=parse(s);return String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."};
const todayISO=()=>iso(new Date());
const monday=s=>{const d=parse(s);const k=(d.getDay()+6)%7;return add(s,-k)};
// ---------- Speicher
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.log)return s}catch(e){}return{v:1,log:{},cp:{}}}
let S=load();
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
let UI={tab:"heute",sel:todayISO(),ex:null,range:"all"};
// ---------- Plan-Logik
function info(s){
  const dd=diff(s,PL.start), dow=parse(s).getDay();
  const r={date:s,dow,pre:dd<0,post:false};
  if(dd<0){r.daysTo=-dd;return r}
  r.week=Math.floor(dd/7)+1;
  if(r.week>PL.weeks){r.post=true;return r}
  r.block=Math.ceil(r.week/4); r.wib=(r.week-1)%4+1;
  r.phase=PL.phases.find(p=>p.blocks.includes(r.block));
  r.deload=r.week%4===0&&!r.phase.noDeload;
  r.cp=PL.checkpoints.find(c=>c.week===r.week);
  let key=null;
  if(r.phase.pattern==="AB"){
    const pat=r.week%2===1?["A","B","A"]:["B","A","B"];
    if(dow===1)key=pat[0];else if(dow===3)key=pat[1];else if(dow===5)key=pat[2];else if(dow===6)key="Sa";
  }else key={1:"Mo",3:"Mi",5:"Fr",6:"Sa"}[dow]||null;
  r.key=key; r.sess=key?r.phase.sessions[key]:null;
  r.sid=key?r.phase.id+"-"+key:null;
  return r;
}
const dlSets=n=>Math.max(1,Math.round(n*0.55));
const planSets=(e,inf)=>inf.deload?dlSets(e.sets):e.sets;
function shortLab(inf){
  if(inf.pre||inf.post||!inf.key)return "–";
  return inf.phase.pattern==="AB"?(inf.key==="Sa"?"Sa":inf.key):inf.key==="Sa"?"Sa":"Studio";
}
// ---------- Log-Helfer
function entry(s,create){
  if(!S.log[s]&&create){const inf=info(s);S.log[s]={sid:inf.sid,title:inf.sess?inf.sess.title:"",ex:{},pain:null,note:"",done:false}}
  return S.log[s];
}
function lastSets(name,before){
  const ds=Object.keys(S.log).filter(d=>d<before).sort().reverse();
  for(const d of ds){const x=S.log[d].ex[name];if(x&&x.some(r=>r&&r.ok))return x.filter(r=>r&&r.ok)}
  return null;
}
const isDone=s=>!!(S.log[s]&&S.log[s].done);
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),1800)}
// ---------- Header
function setTop(){
  const inf=info(UI.sel);
  $("#topsub").textContent=inf.pre?"Start "+fmt(PL.start):inf.post?"Plan abgeschlossen":"Phase "+inf.phase.nr+" · Woche "+inf.week+"/"+PL.weeks+(inf.deload?" · Deload":"");
}
// ---------- HEUTE
function dateNav(){
  const inf=info(UI.sel), t=todayISO();
  const wk=monday(UI.sel);
  let w='<div class="week">';
  for(let i=0;i<7;i++){const d=add(wk,i), fi=info(d);
    w+=`<button data-go="${d}" class="${d===UI.sel?"sel":""} ${d===t?"today":""} ${isDone(d)?"done":""}"><span>${WD[parse(d).getDay()]}</span><b>${parse(d).getDate()}</b><span class="lab">${isDone(d)?"✓ ":""}${esc(shortLab(fi))}</span></button>`}
  w+='</div>';
  return `<div class="datenav"><button class="btn icon" data-step="-1" aria-label="Vorheriger Tag">‹</button>
  <div class="d">${WDL[inf.dow]}, ${fmt(UI.sel)}<small>${UI.sel===t?"Heute":`<a href="#" data-go="${t}" style="color:var(--acc)">Zu heute</a>`}</small></div>
  <button class="btn icon" data-step="1" aria-label="Nächster Tag">›</button></div>
  <div class="row" style="margin-bottom:6px"><button class="btn" data-step="-7" style="min-height:40px;font-size:14px">‹ Woche</button><span class="sp"></span><span class="mut small">${fi2(UI.sel)}</span><span class="sp"></span><button class="btn" data-step="7" style="min-height:40px;font-size:14px">Woche ›</button></div>${w}`;
}
function fi2(s){const i=info(s);return i.pre||i.post?"":"Block "+i.block+" · Woche "+i.wib+"/4"}
function exList(sess,inf){
  return sess.ex.map(e=>{const n=planSets(e,inf);
    return `<div class="ex"><div class="nm">${esc(e.name)}</div><div class="chips"><span class="chip">${esc(e.sxw)}</span>${inf.deload?`<span class="chip" style="color:var(--acc)">Deload: ${n} ${n===1?"Satz":"Sätze"}</span>`:""}<span class="chip"><i>Pause</i> ${esc(e.rest)}</span><span class="chip"><i>RPE</i> ${esc(inf.deload&&/\d/.test(e.rpe)?"max. 6–7":e.rpe)}</span></div>${e.note?`<div class="note">${esc(e.note)}</div>`:""}</div>`}).join("");
}
function vHeute(){
  const inf=info(UI.sel);let h=dateNav();
  if(inf.pre){
    h+=`<div class="card"><h2>Bald geht's los</h2><p class="mut">Phase 1 startet am <b style="color:var(--tx)">Montag, ${fmt(PL.start)}</b> – noch ${inf.daysTo} ${inf.daysTo===1?"Tag":"Tage"}.</p><button class="btn acc wide" data-go="${PL.start}">Erstes Training ansehen</button></div>`;
    h+=rulesCard();return h;
  }
  if(inf.post){return h+`<div class="card"><h2>Jahresplan abgeschlossen</h2><p class="mut">Nach CP6 und Freigabe: 2–3 × Boxen pro Woche, 2 × Kraft (Erhalt) mit Schulter-Pflege.</p></div>`}
  const p=inf.phase;
  h+=`<div class="card"><div class="row"><span class="badge teal">Phase ${p.nr}</span><span class="badge">Block ${inf.block}</span>${inf.deload?'<span class="badge acc">Deload</span>':""}</div>
  <h2 style="margin-top:8px">${esc(p.name)}</h2><div class="mut small">${esc(p.dates)} · ${esc(p.intensity)}</div>
  ${p.progression?`<details style="margin-top:8px"><summary class="small" style="color:var(--teal)">Progression</summary><ul class="list small">${p.progression.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`:""}</div>`;
  if(inf.deload)h+=`<div class="banner">${esc(PL.deload)}</div>`;
  if(inf.cp){const st=(S.cp[inf.cp.id]||{}).status;h+=`<div class="banner teal">Diese Woche: <b>${inf.cp.id}</b> testen (${esc(inf.cp.when)}). ${st==="pass"?"✓ bestanden":`<a href="#" data-tabgo="cp" style="color:var(--teal)">Zum Checkpoint</a>`}</div>`}
  if(p.note)h+=`<div class="banner">${esc(p.note)}</div>`;
  if(!inf.sess){
    h+=`<div class="card"><h2>Ruhetag</h2><p class="mut">${inf.dow===0?"Pause oder lockerer Spaziergang.":"Kein Training geplant. Im Alltag aktiv bleiben, z. B. zügig gehen."}</p></div>`;return h;
  }
  const done=isDone(UI.sel);
  h+=`<div class="card"><div class="row"><span class="badge ${inf.sess.place==="Zuhause"?"grn":"teal"}">${esc(inf.sess.place)}</span>${p.pattern==="AB"&&inf.key!=="Sa"?`<span class="badge">${inf.key}</span>`:""}${done?'<span class="badge grn">✓ erledigt</span>':""}</div>
  <h2 style="margin-top:8px">${esc(inf.sess.title)}</h2>
  <div class="small" style="margin-top:6px;font-weight:700">${p.nr===1?"Schulterblock vor jeder Einheit (ca. 10 Min.)":"Aufwärmen"}</div>
  <ul class="list small mut">${p.warmup.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
  <div class="card"><h3>Übungen</h3>${exList(inf.sess,inf)}${inf.sess.alt?`<div class="banner teal" style="margin:10px 0 0">${esc(inf.sess.alt)}</div>`:""}</div>
  <button class="btn acc wide" data-tabgo="log">${done?"Einträge ansehen":"Training eintragen"}</button>`;
  return h;
}
function rulesCard(){return `<div class="card"><h3>Grundregeln</h3><ul class="list small">${PL.rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>`}
// ---------- EINTRAGEN
function vLog(){
  const inf=info(UI.sel);
  let h=`<div class="datenav"><button class="btn icon" data-step="-1">‹</button><div class="d">${WDL[inf.dow]}, ${fmt(UI.sel)}<small>${inf.sess?esc(inf.sess.title):"Kein Training geplant"}</small></div><button class="btn icon" data-step="1">›</button></div>`;
  if(!inf.sess){return h+`<div class="card empty">An diesem Tag ist kein Training geplant.<br><br><button class="btn" data-tabgo="heute">Zum Tagesplan</button></div>`}
  const en=S.log[UI.sel];
  if(inf.deload)h+=`<div class="banner">Deload: weniger Sätze, Last ca. 10 % tiefer.</div>`;
  inf.sess.ex.forEach((e,ei)=>{
    const cur=(en&&en.ex[e.name])||[], last=lastSets(e.name,UI.sel)||[];
    const n=Math.max(planSets(e,inf),cur.length);
    h+=`<div class="card"><div class="row"><div class="sp"><div style="font-weight:700">${esc(e.name)}</div><div class="mut small">${esc(e.sxw)} · Pause ${esc(e.rest)} · RPE ${esc(e.rpe)}</div></div></div>
    ${last.length?`<div class="note">Letztes Mal: ${last.map(r=>e.f.map(f=>r.v[f]??"–").join("×")).join(", ")}</div>`:""}
    <table class="sets"><tr><th></th>${e.f.map(f=>`<th>${FL[f]}</th>`).join("")}<th></th></tr>`;
    for(let i=0;i<n;i++){const c=cur[i], src=c||last[i]||last[last.length-1];
      h+=`<tr class="${c&&c.ok?"ok":""}" data-ex="${ei}" data-i="${i}"><td class="n">${i+1}</td>${e.f.map(f=>{const v=src&&src.v[f]!=null?src.v[f]:"";return `<td><input inputmode="decimal" data-f="${f}" value="${esc(v)}" class="${c?"":"pre"}" aria-label="${FL[f]} Satz ${i+1}"></td>`}).join("")}<td style="width:52px"><button class="chk" data-chk aria-label="Satz erledigt">✓</button></td></tr>`}
    h+=`</table><button class="btn" data-addset="${ei}" style="min-height:40px;font-size:14px;margin-top:4px">+ Satz</button></div>`;
  });
  const pain=en&&en.pain!=null?en.pain:null;
  h+=`<div class="card"><h3>Schulterschmerz links (0–10)</h3><div class="mut small">Höchster Wert während des Trainings. Regel: max. 3/10.</div><div class="pain">${[...Array(11).keys()].map(i=>`<button data-pain="${i}" class="${pain===i?"on":""} ${i>3?"hi":""}">${i}</button>`).join("")}</div></div>
  <div class="card"><h3>Notiz</h3><textarea id="note" placeholder="Gefühl, Anpassungen, Folgetag …">${esc(en?en.note:"")}</textarea></div>
  <button class="btn ${en&&en.done?"":"grn"} wide" id="donebtn">${en&&en.done?"Als nicht erledigt markieren":"✓ Einheit abschliessen"}</button>`;
  return h;
}
function readRow(tr){const v={};tr.querySelectorAll("input").forEach(i=>{const x=i.value.trim().replace(",",".");v[i.dataset.f]=x===""?null:(isNaN(+x)?x:+x)});return v}
// ---------- FORTSCHRITT
function doneDates(){return Object.keys(S.log).filter(d=>S.log[d].done).sort()}
function exNames(){const s=new Set();Object.values(S.log).forEach(en=>Object.entries(en.ex).forEach(([n,a])=>{if(a.some(r=>r&&r.ok))s.add(n)}));return [...s].sort((a,b)=>a.localeCompare(b,"de"))}
function svgLine(pts,{color="#f2a541",min=null,max=null,unit="",bars=false,h=180}={}){
  const W=340,H=h,L=34,R=8,T=12,B=26;
  if(!pts.length)return `<div class="empty small">Noch keine Daten</div>`;
  let lo=min!=null?min:Math.min(...pts.map(p=>p.y)), hi=max!=null?max:Math.max(...pts.map(p=>p.y));
  if(bars)lo=0; if(hi===lo){hi=lo+1} const pad=(hi-lo)*.08; if(min==null&&!bars)lo=Math.max(0,lo-pad); if(max==null)hi=hi+pad;
  const n=pts.length, X=i=>bars?L+(W-L-R)*(i+.5)/n:(n===1?L+(W-L-R)/2:L+(W-L-R)*i/(n-1)), Y=v=>T+(H-T-B)*(1-(v-lo)/(hi-lo));
  const rough=(hi-lo)/4, mag=Math.pow(10,Math.floor(Math.log10(rough))), st=[1,2,2.5,5,10].map(m=>m*mag).find(x=>x>=rough);
  let g="";for(let v=Math.ceil(lo/st)*st;v<=hi+1e-9;v+=st){const y=Y(v);g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#2a323c"/><text x="${L-4}" y="${y+3}" fill="#8b98a5" font-size="9" text-anchor="end">${+v.toFixed(2)}</text>`}
  const step=Math.ceil(n/6);let xl="";pts.forEach((p,i)=>{if(i%step===0||i===n-1)xl+=`<text x="${X(i)}" y="${H-8}" fill="#8b98a5" font-size="9" text-anchor="middle">${esc(p.x)}</text>`});
  let body="";
  if(bars){const bw=Math.max(4,(W-L-R)/n*.62);pts.forEach((p,i)=>{body+=`<rect x="${X(i)-bw/2}" y="${Y(p.y)}" width="${bw}" height="${Math.max(0,Y(lo)-Y(p.y))}" rx="3" fill="${p.c||color}"/>`;if(n<=16&&p.y>0)body+=`<text x="${X(i)}" y="${Y(p.y)-3}" fill="#e6edf3" font-size="9" text-anchor="middle">${p.y}</text>`})}
  else{body=`<polyline fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" points="${pts.map((p,i)=>X(i)+","+Y(p.y)).join(" ")}"/>`+pts.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.y)}" r="3.5" fill="${p.c||color}"/>`).join("")}
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${g}${body}${xl}</svg>`;
}
function weekOf(d){return Math.floor(diff(d,PL.start)/7)+1}
function vStats(){
  const dd=doneDates(), t=todayISO();
  const perW={};dd.forEach(d=>{const w=weekOf(d);perW[w]=(perW[w]||0)+1});
  let cw=Math.max(1,Math.min(PL.weeks,weekOf(t)));
  let streak=0,w=cw;if((perW[w]||0)<3)w--;while(w>=1&&(perW[w]||0)>=3){streak++;w--}
  let h=`<div class="kpis"><div><b>${dd.length}</b><span>Einheiten total</span></div><div><b>${perW[cw]||0}</b><span>diese Woche</span></div><div><b>${streak}</b><span>Wochen ≥ 3 in Folge</span></div></div>`;
  // Einheiten pro Woche
  const last=Math.max(cw, ...Object.keys(perW).map(Number), 1), first=Math.max(1,last-11);
  const wp=[];for(let k=first;k<=last;k++)wp.push({x:"W"+k,y:perW[k]||0,c:(perW[k]||0)>=3?"#3fb950":"#2bb3c0"});
  h+=`<div class="card"><h3>Einheiten pro Woche</h3><div class="mut small">Grün = Ziel von mind. 3 erreicht</div>${svgLine(wp,{bars:true,max:5})}</div>`;
  // Übung
  const names=exNames(); if(!UI.ex||!names.includes(UI.ex))UI.ex=names[0]||null;
  h+=`<div class="card"><h3>Übung</h3>`;
  if(!names.length)h+=`<div class="empty small">Noch keine abgehakten Sätze. Trage im Tab „Eintragen“ ein Training ein.</div>`;
  else{
    h+=`<select id="exsel">${names.map(n=>`<option ${n===UI.ex?"selected":""}>${esc(n)}</option>`).join("")}</select>`;
    const ds=Object.keys(S.log).sort().filter(d=>(S.log[d].ex[UI.ex]||[]).some(r=>r&&r.ok));
    const rows=ds.map(d=>({d,s:S.log[d].ex[UI.ex].filter(r=>r&&r.ok)}));
    const hasKg=rows.some(r=>r.s.some(x=>typeof x.v.kg==="number"));
    const f0=hasKg?"kg":(Object.keys(rows[0].s[0].v)[0]);
    const best=rows.map(r=>({x:fmtS(r.d),y:Math.max(...r.s.map(x=>+x.v[f0]||0))}));
    h+=`<div class="small" style="margin-top:10px;font-weight:700">${hasKg?"Höchstes Gewicht (kg)":"Bester Wert ("+FL[f0]+")"}</div>${svgLine(best,{unit:FL[f0]})}`;
    if(hasKg){const vol=rows.map(r=>({x:fmtS(r.d),y:Math.round(r.s.reduce((a,x)=>a+(+x.v.kg||0)*(+(x.v.wdh??x.v.m??x.v.sek)||0),0))}));
      h+=`<div class="small" style="margin-top:10px;font-weight:700">Volumen (kg × Wdh. bzw. m)</div>${svgLine(vol,{bars:true,color:"#2bb3c0",unit:"kg"})}`}
  }
  h+=`</div>`;
  const pp=Object.keys(S.log).sort().filter(d=>S.log[d].pain!=null).map(d=>({x:fmtS(d),y:S.log[d].pain,c:S.log[d].pain>3?"#f85149":"#f2a541"}));
  h+=`<div class="card"><h3>Schulterschmerz-Verlauf</h3><div class="mut small">Grenze 3/10 · rote Punkte = darüber</div>${svgLine(pp,{min:0,max:10,unit:"0–10"})}</div>`;
  return h;
}
// ---------- CHECKPOINTS
function cpDate(c){const s=add(PL.start,(c.week-1)*7);return s}
function vCP(){
  const t=todayISO();
  const passed=PL.checkpoints.filter(c=>(S.cp[c.id]||{}).status==="pass").map(c=>c.id);
  let h=`<div class="card"><h2>Schulter-Checkpoints</h2><div class="mut small">${esc(PL.cpNote)}</div><div class="chips" style="margin-top:8px">${PL.checkpoints.map(c=>{const st=(S.cp[c.id]||{}).status;return `<span class="badge ${st==="pass"?"grn":st==="fail"?"red":""}">${c.id}${st==="pass"?" ✓":st==="fail"?" ✗":""}</span>`}).join("")}</div></div>`;
  PL.checkpoints.forEach(c=>{
    const r=S.cp[c.id]||{}, st=r.status||"open", d0=cpDate(c), dn=diff(d0,t);
    const when=dn>0?`in ${dn} Tagen`:dn>-7?"diese Woche":"fällig seit "+fmt(d0);
    h+=`<div class="card cp" data-cp="${c.id}"><div class="row"><span class="badge teal">${c.id}</span><span class="mut small">${esc(c.dates)} · ${esc(c.when)}</span><span class="sp"></span><span class="badge ${st==="pass"?"grn":st==="fail"?"red":""}">${st==="pass"?"Bestanden":st==="fail"?"Nicht bestanden":"Offen"}</span></div>
    <div class="mut small" style="margin-top:4px">${st==="open"?"Testwoche "+when:(r.date?"Getestet am "+fmt(r.date):"")}</div>
    <div class="tests">${c.tests.map((x,i)=>`<div class="t"><label>${esc(x)}</label><input type="text" data-res="${i}" placeholder="Ergebnis, Schmerz 0–10" value="${esc((r.res||[])[i]||"")}"></div>`).join("")}</div>
    <div class="crit"><b>Kriterium:</b> ${esc(c.criteria)}</div>
    <div class="crit"><b>Gibt frei:</b> ${esc(c.unlocks)}</div>
    <div class="row" style="margin:8px 0"><label class="small mut" style="min-width:70px">Testdatum</label><input type="date" data-cpdate value="${esc(r.date||"")}"></div>
    <textarea data-cpnote placeholder="Notiz (z. B. Physio-Befund, Folgetag)">${esc(r.note||"")}</textarea>
    <div class="row" style="margin-top:10px"><button class="btn ${st==="pass"?"grn":""}" data-st="pass" style="flex:1">✓ Bestanden</button><button class="btn ${st==="fail"?"red":""}" data-st="fail" style="flex:1">✗ Nicht</button><button class="btn" data-st="open">Offen</button></div></div>`;
  });
  return h;
}
// ---------- DATEN
function vData(){
  const n=Object.keys(S.log).length;
  return `<div class="card"><h2>Backup</h2><p class="mut small">Alle Daten liegen nur auf diesem Gerät (localStorage). Exportiere regelmässig ein Backup, z. B. in die Dateien-App oder iCloud Drive.</p>
  <div class="mut small">${n} Tage mit Einträgen · ${Object.keys(S.cp).length} Checkpoint-Einträge</div>
  <button class="btn acc wide" id="exp" style="margin-top:10px">Backup exportieren (JSON)</button>
  <label class="btn wide" style="display:flex;align-items:center;justify-content:center;margin-top:8px">Backup importieren<input type="file" id="imp" accept="application/json,.json" style="display:none"></label></div>
  <div class="card"><h3>Auf dem iPhone installieren</h3><p class="mut small">In Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm“. Danach funktioniert die App auch offline.</p></div>
  ${rulesCard()}
  <div class="card"><h3>Alle Daten löschen</h3><p class="mut small">Löscht alle Einträge und Checkpoints auf diesem Gerät.</p><button class="btn red wide" id="wipe">Alles löschen</button></div>
  <div class="mut small" style="text-align:center">Plan: ${esc(fmt(PL.start))} – 24.10.2027 · Daten in plan.js</div>`;
}
async function doExport(){
  const name="training-backup-"+todayISO()+".json", blob=new Blob([JSON.stringify(S,null,1)],{type:"application/json"});
  try{const f=new File([blob],name,{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Training Backup"});return}}catch(e){if(e&&e.name==="AbortError")return}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast("Backup exportiert");
}
// ---------- Rendern + Events
function render(){
  setTop();
  const v={heute:vHeute,log:vLog,stats:vStats,cp:vCP,data:vData}[UI.tab]();
  $("#view").innerHTML=v;
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab===UI.tab));
}
function go(tab){UI.tab=tab;render();window.scrollTo(0,0)}
document.addEventListener("click",ev=>{
  const b=ev.target.closest("button,a");if(!b)return;
  if(b.dataset.tab)return go(b.dataset.tab);
  if(b.dataset.tabgo){ev.preventDefault();return go(b.dataset.tabgo)}
  if(b.dataset.go){ev.preventDefault();UI.sel=b.dataset.go;return render()}
  if(b.dataset.step){UI.sel=add(UI.sel,+b.dataset.step);return render()}
  if(b.hasAttribute("data-chk")){
    const tr=b.closest("tr"), inf=info(UI.sel), e=inf.sess.ex[+tr.dataset.ex], en=entry(UI.sel,true);
    const arr=en.ex[e.name]||(en.ex[e.name]=[]), i=+tr.dataset.i, ok=!(arr[i]&&arr[i].ok);
    arr[i]={v:readRow(tr),ok}; for(let k=0;k<arr.length;k++)if(!arr[k])arr[k]={v:{},ok:false};
    save(); tr.classList.toggle("ok",ok); tr.querySelectorAll("input").forEach(x=>x.classList.remove("pre")); return;
  }
  if(b.dataset.addset!=null){const inf=info(UI.sel),e=inf.sess.ex[+b.dataset.addset],en=entry(UI.sel,true),arr=en.ex[e.name]||(en.ex[e.name]=[]);
    const n=Math.max(planSets(e,inf),arr.length);while(arr.length<n)arr.push({v:{},ok:false});const src=arr.filter(r=>r.ok).pop()||lastSets(e.name,UI.sel)?.slice(-1)[0];arr.push({v:src?{...src.v}:{},ok:false});save();return render()}
  if(b.dataset.pain!=null){const en=entry(UI.sel,true);const p=+b.dataset.pain;en.pain=en.pain===p?null:p;save();document.querySelectorAll("[data-pain]").forEach(x=>x.classList.toggle("on",+x.dataset.pain===en.pain));return}
  if(b.id==="donebtn"){const en=entry(UI.sel,true);en.done=!en.done;en.doneAt=en.done?new Date().toISOString():null;save();toast(en.done?"Einheit abgeschlossen 💪":"Markierung entfernt");return render()}
  if(b.dataset.st){const id=b.closest("[data-cp]").dataset.cp;const r=S.cp[id]||(S.cp[id]={});r.status=b.dataset.st;if(r.status!=="open"&&!r.date)r.date=todayISO();save();return render()}
  if(b.id==="exp")return doExport();
  if(b.id==="wipe"){if(confirm("Wirklich alle Trainingsdaten auf diesem Gerät löschen?")){S={v:1,log:{},cp:{}};save();toast("Alle Daten gelöscht");render()}return}
});
document.addEventListener("input",ev=>{
  const t=ev.target;
  if(t.id==="note"){const en=entry(UI.sel,true);en.note=t.value;save();return}
  if(t.dataset.f){const tr=t.closest("tr"),inf=info(UI.sel),e=inf.sess.ex[+tr.dataset.ex],en=entry(UI.sel,true),arr=en.ex[e.name]||(en.ex[e.name]=[]),i=+tr.dataset.i;
    for(let k=0;k<=i;k++)if(!arr[k])arr[k]={v:{},ok:false};arr[i].v=readRow(tr);tr.querySelectorAll("input").forEach(x=>x.classList.remove("pre"));save();return}
  const cp=t.closest&&t.closest("[data-cp]");
  if(cp){const r=S.cp[cp.dataset.cp]||(S.cp[cp.dataset.cp]={});if(t.dataset.res!=null){(r.res||(r.res=[]))[+t.dataset.res]=t.value}else if(t.hasAttribute("data-cpdate"))r.date=t.value;else if(t.hasAttribute("data-cpnote"))r.note=t.value;save()}
});
document.addEventListener("change",ev=>{
  const t=ev.target;
  if(t.id==="exsel"){UI.ex=t.value;render()}
  if(t.id==="imp"&&t.files[0]){const fr=new FileReader();fr.onload=()=>{try{const d=JSON.parse(fr.result);if(!d||typeof d.log!=="object")throw 0;if(confirm("Backup importieren? Die aktuellen Daten werden ersetzt.")){S={v:1,log:d.log||{},cp:d.cp||{}};save();toast("Backup importiert");render()}}catch(e){alert("Die Datei ist kein gültiges Backup.")}};fr.readAsText(t.files[0])}
});
window.__app={info,get S(){return S},render,set sel(v){UI.sel=v}};
render();
if("serviceWorker" in navigator&&location.protocol!=="file:")navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
