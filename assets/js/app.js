const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

async function loadJSON(path, fallback=null){
  try{
    const r = await fetch(path, {cache:"no-store"});
    if(!r.ok) throw new Error(`${path}: ${r.status}`);
    return await r.json();
  }catch(e){
    console.warn("Could not load", path, e);
    return fallback;
  }
}
function esc(v=""){
  return String(v).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function nl(v=""){ return esc(v).replace(/\n/g,"<br>"); }

async function applySite(){
  const s = await loadJSON("data/site.json", {});
  $$("[data-site]").forEach(el=>{
    const key=el.dataset.site;
    if(s[key]!==undefined) el.textContent=s[key];
  });
  $$("[data-site-mail]").forEach(el=>{
    if(s.email){el.textContent=s.email; el.href=`mailto:${s.email}`;}
  });
  $$("[data-site-phone]").forEach(el=>{
    if(s.phone){el.textContent=s.phone; el.href=`tel:${s.phone.replace(/[^0-9+]/g,"")}`;}
  });
  return s;
}
function initNav(){
  const btn=$(".menu-btn"), menu=$(".menu");
  if(btn&&menu) btn.addEventListener("click",()=>menu.classList.toggle("open"));
  $$(".menu a").forEach(a=>a.addEventListener("click",()=>menu?.classList.remove("open")));
}
function initYear(){
  $$(".current-year").forEach(el=>el.textContent=new Date().getFullYear());
}

async function homePage(){
  const s=await applySite();
  if($("#hero-title")){
    $("#hero-title").innerHTML=`${esc(s.hero_title_before||"Exploring")} <em>${esc(s.hero_title_highlight||"cognition")}</em>, ${esc(s.hero_title_after||"behavior, and the aging brain.")}`;
  }
  if($("#home-research")){
    const items=await loadJSON("data/research.json",[]);
    $("#home-research").innerHTML=items.slice(0,3).map((x,i)=>`
      <article class="card"><div class="icon">${String(i+1).padStart(2,"0")}</div>
      <h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></article>`).join("");
  }
  if($("#home-projects")){
    const items=await loadJSON("data/projects.json",[]);
    $("#home-projects").innerHTML=items.slice(0,2).map(x=>`
      <article class="project"><div class="meta">${esc(x.start_year)} · ${esc(x.status)}</div>
      <h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></article>`).join("");
  }
  if($("#home-news")){
    const items=await loadJSON("data/news.json",[]);
    $("#home-news").innerHTML=items.slice(0,3).map(newsCard).join("") || emptyBlock("등록된 소식이 없습니다.","Pages CMS에서 News를 추가할 수 있습니다.");
  }
}
function newsCard(x, full=false){
  const image=x.image ? `<div class="news-img"><img src="${esc(x.image)}" alt=""></div>` : `<div class="news-img">LAB NEWS</div>`;
  const summary=esc(x.summary||x.body||"");
  const detail=(full && x.body && x.body!==x.summary)
    ? `<div class="news-detail">${nl(x.body)}</div>` : "";
  return `<article class="news-card">${image}<div class="news-body"><div class="news-date">${esc(x.date)}</div><h3>${esc(x.title)}</h3><p>${summary}</p>${detail}</div></article>`;
}
function emptyBlock(title,text){
  return `<div class="empty"><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
}

async function researchPage(){
  await applySite();
  const areas=(await loadJSON("data/research.json",[])).slice().sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999));
  const projects=await loadJSON("data/projects.json",[]);
  const topics=await loadJSON("data/research_topics.json",[]);
  $("#research-grid").innerHTML=areas.map((x,i)=>`
    <article class="card"><div class="icon">${String(i+1).padStart(2,"0")}</div>
    <h3>${esc(x.title)}</h3><p style="color:#2b6de0;font-size:.8rem;font-weight:800;margin:-3px 0 10px">${esc(x.title_ko||"")}</p><p>${esc(x.description)}</p></article>`).join("");
  $("#project-grid").innerHTML=projects.map(x=>`
    <article class="project"><div class="meta">${esc(x.start_year)} · ${esc(x.status)}</div>
    <h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></article>`).join("");
  const topicRoot=$("#research-topics");
  if(topicRoot){
    topicRoot.innerHTML=topics.map((x,i)=>`
      <article class="topic-card">
        <div class="topic-num">${String(i+1).padStart(2,"0")}</div>
        <div><h3>${esc(x.category)}</h3>
        ${(x.examples||[]).length?`<ul>${x.examples.map(v=>`<li>${esc(v)}</li>`).join("")}</ul>`:`<p>관련 연구를 수행합니다.</p>`}</div>
      </article>`).join("");
  }
}

async function professorPage(){
  await applySite();
  const p=await loadJSON("data/professor.json",{});
  if(p.photo) $("#prof-photo").src=p.photo;
  $("#prof-name-ko").textContent=p.name_ko||"";
  $("#prof-name-en").textContent=[p.name_en,p.degree].filter(Boolean).join(", ");
  $("#prof-position").textContent=p.position||"";
  $("#prof-chips").innerHTML=(p.research_interests||[]).map(x=>`<span class="chip">${esc(x)}</span>`).join("");
  $("#prof-email").textContent=p.email||""; $("#prof-email").href=`mailto:${p.email||""}`;
  $("#prof-phone").textContent=p.phone||"";
  $("#prof-education").innerHTML=(p.education||[]).map(x=>`<div class="titem"><div class="tdate">${esc(x.period)}</div><div class="ttext"><strong>${esc(x.institution)} ${esc(x.degree)}</strong><span>${esc(x.major)}</span></div></div>`).join("");
  $("#prof-career").innerHTML=(p.career||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const b=p.book||{};
  $("#prof-book").innerHTML=b.title?`<div class="book-icon"></div><div><div class="eyebrow">Book</div><h3>${esc(b.title)}</h3><p>${esc(b.year)} · ${esc(b.role)}</p></div>`:"";
}


async function programPage(){
  await applySite();
  const p=await loadJSON("data/program.json",{});
  const roles=await loadJSON("data/roles.json",[]);
  const curriculum=await loadJSON("data/curriculum.json",[]);
  const training=await loadJSON("data/training.json",[]);
  const conferences=await loadJSON("data/conferences.json",{});
  const career=await loadJSON("data/career.json",{});

  if($("#program-intro-title")) $("#program-intro-title").textContent=p.intro_title||"What is Clinical Neuropsychology?";
  if($("#program-definition")) $("#program-definition").textContent=p.definition||"";
  if($("#neuropsychology-definition")) $("#neuropsychology-definition").textContent=p.neuropsychology_definition||"";
  if($("#target-diseases")) $("#target-diseases").innerHTML=(p.target_diseases||[]).map(x=>`<span class="chip">${esc(x)}</span>`).join("");

  $("#role-grid").innerHTML=roles.map((x,i)=>`
    <article class="card role-card"><div class="icon">${String(i+1).padStart(2,"0")}</div>
    <h3>${esc(x.title)}</h3><div class="small-title">${esc(x.title_ko||"")}</div><p>${esc(x.description||"")}</p></article>`).join("");

  $("#assessment-description").textContent=p.assessment_description||"";
  $("#assessment-functions").innerHTML=(p.assessment_functions||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  $("#assessment-uses").innerHTML=(p.assessment_uses||[]).map(x=>`<li>${esc(x)}</li>`).join("");

  $("#curriculum-table").innerHTML=curriculum.map(x=>`
    <tr><td>${esc(x.code)}</td><td><strong>${esc(x.name_ko)}</strong></td><td>${esc(x.name_en)}</td></tr>`).join("");

  $("#training-grid").innerHTML=training.map(x=>`
    <article class="training-card"><div class="training-kicker">${esc(x.title)}</div>
    <h3>${esc(x.title_ko)}</h3><div class="training-meta">${esc(x.frequency||"")}</div>
    ${x.location?`<p class="training-place">${esc(x.location)}</p>`:""}
    <ul>${(x.details||[]).map(v=>`<li>${esc(v)}</li>`).join("")}</ul></article>`).join("");

  $("#conference-domestic").innerHTML=(conferences.domestic||[]).map(x=>`<span class="conference-chip">${esc(x)}</span>`).join("");
  $("#conference-international").innerHTML=(conferences.international||[]).map(x=>`<span class="conference-chip">${esc(x)}</span>`).join("");

  $("#ideal-traits").innerHTML=(p.ideal_traits||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  $("#recommended-psychology").innerHTML=(p.recommended_psychology_courses||[]).map(x=>`<span class="course-chip">${esc(x)}</span>`).join("");
  $("#recommended-clinical").innerHTML=(p.recommended_clinical_courses||[]).map(x=>`<span class="course-chip">${esc(x)}</span>`).join("");

  $("#career-pathway").innerHTML=(career.pathway||[]).map((x,i)=>`
    <div class="path-step"><div class="path-index">${i+1}</div><span>${esc(x)}</span></div>`).join("");

  $("#career-destinations").innerHTML=(career.destinations||[]).map(x=>`
    <article class="destination"><h3>${esc(x.category)}</h3><ul>${(x.items||[]).map(v=>`<li>${esc(v)}</li>`).join("")}</ul></article>`).join("");

  $("#consultation-note").textContent=p.consultation_note||"";
}

async function publicationsPage(){
  await applySite();
  const pubs=await loadJSON("data/publications.json",[]);
  const search=$("#pub-search"), cat=$("#pub-category");
  const cats=[...new Set(pubs.map(x=>x.category).filter(Boolean))];
  cat.innerHTML=`<option value="">전체 구분</option>`+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
  const render=()=>{
    const q=(search.value||"").trim().toLowerCase(), c=cat.value;
    const list=pubs.filter(x=>(!q||`${x.title} ${x.journal} ${x.date}`.toLowerCase().includes(q))&&(!c||x.category===c));
    $("#pub-list").innerHTML=list.map(x=>`<div class="pub"><div class="pub-date">${esc(x.date)}</div><div><div class="pub-title">${esc(x.title)}</div><div class="pub-meta">${esc(x.journal)}</div></div><span class="tag">${esc(x.category||"")}</span></div>`).join("")||emptyBlock("검색 결과가 없습니다.","다른 검색어를 입력해 주세요.");
  };
  search.addEventListener("input",render); cat.addEventListener("change",render); render();
}

async function peoplePage(){
  await applySite();
  const members=await loadJSON("data/members.json",[]);
  const root=$("#member-grid");
  if(!members.length){root.innerHTML=emptyBlock("구성원 정보를 준비 중입니다.","Pages CMS에서 구성원을 추가하면 이 페이지에 자동으로 표시됩니다.");return;}
  root.innerHTML=members.map(x=>`<article class="member"><div class="member-photo">${x.photo?`<img src="${esc(x.photo)}" alt="${esc(x.name)}">`:""}</div><div class="member-body"><h3>${esc(x.name)}</h3><div class="member-role">${esc(x.role)}</div><p>${esc(x.interests||"")}</p>${x.email?`<p style="margin-top:8px"><a href="mailto:${esc(x.email)}">${esc(x.email)}</a></p>`:""}</div></article>`).join("");
}

async function newsPage(){
  await applySite();
  const items=await loadJSON("data/news.json",[]);
  $("#news-grid").innerHTML=items.map(x=>newsCard(x,true)).join("")||emptyBlock("등록된 소식이 없습니다.","Pages CMS에서 새 소식을 추가할 수 있습니다.");
}

async function resourcesPage(){
  await applySite();
  const items=await loadJSON("data/resources.json",[]);
  const root=$("#resource-list");
  if(!items.length){root.innerHTML=emptyBlock("등록된 자료가 없습니다.","관리자 화면에서 PDF·문서 파일을 업로드하면 이곳에 표시됩니다.");return;}
  root.innerHTML=items.map(x=>`<article class="resource"><div class="file-icon">↓</div><div><h3>${esc(x.title)}</h3><p>${esc(x.description||"")}</p></div><a class="btn secondary" href="${esc(x.file)}" target="_blank" rel="noopener">파일 열기</a></article>`).join("");
}

async function contactPage(){
  const s=await applySite();
  if(s.map_image) $("#campus-map").src=s.map_image;
  const p=await loadJSON("data/program.json",{});
  const note=$("#contact-consultation");
  if(note) note.textContent=p.consultation_note||"";
}
document.addEventListener("DOMContentLoaded",()=>{
  initNav(); initYear();
  const page=document.body.dataset.page;
  ({home:homePage,research:researchPage,professor:professorPage,program:programPage,publications:publicationsPage,people:peoplePage,news:newsPage,resources:resourcesPage,contact:contactPage}[page]||applySite)();
});