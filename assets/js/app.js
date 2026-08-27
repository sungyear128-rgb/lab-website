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
  return String(v ?? "").replace(/[&<>"']/g, m=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
function nl(v=""){ return esc(v).replace(/\n/g,"<br>"); }
function text(v){ return v == null ? "" : String(v); }
function clean(v){ return text(v).trim(); }
function nonEmpty(v){ return clean(v) !== ""; }
function cleanList(v){ return Array.isArray(v) ? v.filter(nonEmpty) : []; }
function joinParts(parts, separator=" · "){ return parts.filter(nonEmpty).map(clean).join(separator); }

function setTextElement(el, value, hideWhenEmpty=true){
  if(!el) return;
  const valueText=text(value);
  el.textContent=valueText;
  if(hideWhenEmpty) el.hidden=!nonEmpty(valueText);
}

function setHTMLOrHide(el, html){
  if(!el) return;
  el.innerHTML=html || "";
  el.hidden=!nonEmpty(html);
}

async function applySite(){
  const s = await loadJSON("data/site.json", {});

  // CMS 값이 없거나 빈 문자열이면 HTML 기본문구를 되살리지 않고 실제로 비웁니다.
  $$("[data-site]").forEach(el=>{
    const key=el.dataset.site;
    setTextElement(el, s?.[key] ?? "");
  });

  $$("[data-site-mail]").forEach(el=>{
    const value=clean(s?.email);
    el.textContent=value;
    el.hidden=!value;
    if(value) el.href=`mailto:${value}`;
    else el.removeAttribute("href");
  });

  $$("[data-site-phone]").forEach(el=>{
    const value=clean(s?.phone);
    el.textContent=value;
    el.hidden=!value;
    if(value) el.href=`tel:${value.replace(/[^0-9+]/g,"")}`;
    else el.removeAttribute("href");
  });

  return s || {};
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

  // 어떤 필드에도 자동 기본값을 넣지 않습니다.
  const before=clean(s.hero_title_before);
  const highlight=clean(s.hero_title_highlight);
  const after=clean(s.hero_title_after);

  if($("#hero-title")){
    let html="";
    if(before) html+=esc(before);
    if(highlight) html+=`${before?" ":""}<em>${esc(highlight)}</em>`;
    if(after) html+=`${(before||highlight)?", ":""}${esc(after)}`;
    $("#hero-title").innerHTML=html;
    $("#hero-title").hidden=!nonEmpty(html);
  }

  if($("#home-research")){
    const items=await loadJSON("data/research.json",[]);
    const visible=(items||[]).filter(x=>nonEmpty(x?.title)||nonEmpty(x?.description));
    $("#home-research").innerHTML=visible.slice(0,3).map((x,i)=>`
      <article class="card">
        <div class="icon">${String(i+1).padStart(2,"0")}</div>
        ${nonEmpty(x.title)?`<h3>${esc(x.title)}</h3>`:""}
        ${nonEmpty(x.description)?`<p>${esc(x.description)}</p>`:""}
      </article>`).join("");
  }

  if($("#home-projects")){
    const items=await loadJSON("data/projects.json",[]);
    const visible=(items||[]).filter(x=>nonEmpty(x?.title)||nonEmpty(x?.description)||nonEmpty(x?.start_year)||nonEmpty(x?.status));
    $("#home-projects").innerHTML=visible.slice(0,2).map(x=>{
      const meta=joinParts([x.start_year,x.status]);
      return `<article class="project">
        ${meta?`<div class="meta">${esc(meta)}</div>`:""}
        ${nonEmpty(x.title)?`<h3>${esc(x.title)}</h3>`:""}
        ${nonEmpty(x.description)?`<p>${esc(x.description)}</p>`:""}
      </article>`;
    }).join("");
  }

  if($("#home-news")){
    const items=await loadJSON("data/news.json",[]);
    $("#home-news").innerHTML=(items||[]).slice(0,3).map(x=>newsCard(x,false)).join("")
      || emptyBlock("등록된 소식이 없습니다.","Pages CMS에서 News를 추가할 수 있습니다.");
  }
}

function newsCard(x, full=false){
  const image=nonEmpty(x?.image)
    ? `<div class="news-img"><img src="${esc(x.image)}" alt=""></div>`
    : "";

  // summary가 비어 있으면 body를 대신 복사하지 않습니다.
  const summary=clean(x?.summary);
  const body=clean(x?.body);
  const detail=(full && body) ? `<div class="news-detail">${nl(body)}</div>` : "";

  return `<article class="news-card">
    ${image}
    <div class="news-body">
      ${nonEmpty(x?.date)?`<div class="news-date">${esc(x.date)}</div>`:""}
      ${nonEmpty(x?.title)?`<h3>${esc(x.title)}</h3>`:""}
      ${summary?`<p>${esc(summary)}</p>`:""}
      ${detail}
    </div>
  </article>`;
}

function emptyBlock(title,text){
  return `<div class="empty"><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
}

async function researchPage(){
  await applySite();
  const areas=(await loadJSON("data/research.json",[]) || [])
    .filter(x=>nonEmpty(x?.title)||nonEmpty(x?.title_ko)||nonEmpty(x?.description))
    .slice()
    .sort((a,b)=>(Number(a.order)||999)-(Number(b.order)||999));

  const projects=(await loadJSON("data/projects.json",[]) || [])
    .filter(x=>nonEmpty(x?.title)||nonEmpty(x?.description)||nonEmpty(x?.start_year)||nonEmpty(x?.status));

  const topics=(await loadJSON("data/research_topics.json",[]) || [])
    .filter(x=>nonEmpty(x?.category)||cleanList(x?.examples).length);

  if($("#research-grid")){
    $("#research-grid").innerHTML=areas.map((x,i)=>`
      <article class="card">
        <div class="icon">${String(i+1).padStart(2,"0")}</div>
        ${nonEmpty(x.title)?`<h3>${esc(x.title)}</h3>`:""}
        ${nonEmpty(x.title_ko)?`<p style="color:#2b6de0;font-size:.8rem;font-weight:800;margin:-3px 0 10px">${esc(x.title_ko)}</p>`:""}
        ${nonEmpty(x.description)?`<p>${esc(x.description)}</p>`:""}
      </article>`).join("");
  }

  if($("#project-grid")){
    $("#project-grid").innerHTML=projects.map(x=>{
      const meta=joinParts([x.start_year,x.status]);
      return `<article class="project">
        ${meta?`<div class="meta">${esc(meta)}</div>`:""}
        ${nonEmpty(x.title)?`<h3>${esc(x.title)}</h3>`:""}
        ${nonEmpty(x.description)?`<p>${esc(x.description)}</p>`:""}
      </article>`;
    }).join("");
  }

  const topicRoot=$("#research-topics");
  if(topicRoot){
    topicRoot.innerHTML=topics.map((x,i)=>{
      const examples=cleanList(x.examples);
      return `<article class="topic-card">
        <div class="topic-num">${String(i+1).padStart(2,"0")}</div>
        <div>
          ${nonEmpty(x.category)?`<h3>${esc(x.category)}</h3>`:""}
          ${examples.length?`<ul>${examples.map(v=>`<li>${esc(v)}</li>`).join("")}</ul>`:""}
        </div>
      </article>`;
    }).join("");
  }
}

async function professorPage(){
  await applySite();
  const p=await loadJSON("data/professor.json",{}) || {};

  const photo=$("#prof-photo");
  if(photo){
    if(nonEmpty(p.photo)){ photo.src=p.photo; photo.hidden=false; }
    else photo.hidden=true;
  }

  setTextElement($("#prof-name-ko"),p.name_ko);
  const enDegree=joinParts([p.name_en,p.degree],", ");
  setTextElement($("#prof-name-en"),enDegree);
  setTextElement($("#prof-position"),p.position);

  const interests=cleanList(p.research_interests);
  setHTMLOrHide($("#prof-chips"),interests.map(x=>`<span class="chip">${esc(x)}</span>`).join(""));

  const email=$("#prof-email");
  if(email){
    const value=clean(p.email);
    email.textContent=value; email.hidden=!value;
    if(value) email.href=`mailto:${value}`; else email.removeAttribute("href");
  }
  setTextElement($("#prof-phone"),p.phone);

  const education=(Array.isArray(p.education)?p.education:[])
    .filter(x=>nonEmpty(x?.period)||nonEmpty(x?.institution)||nonEmpty(x?.degree)||nonEmpty(x?.major));
  setHTMLOrHide($("#prof-education"),education.map(x=>{
    const schoolDegree=joinParts([x.institution,x.degree]," ");
    return `<div class="titem">
      ${nonEmpty(x.period)?`<div class="tdate">${esc(x.period)}</div>`:""}
      <div class="ttext">
        ${schoolDegree?`<strong>${esc(schoolDegree)}</strong>`:""}
        ${nonEmpty(x.major)?`<span>${esc(x.major)}</span>`:""}
      </div>
    </div>`;
  }).join(""));

  const career=cleanList(p.career);
  setHTMLOrHide($("#prof-career"),career.map(x=>`<li>${esc(x)}</li>`).join(""));

  // Research Interests 박스의 고정 문구도 CMS 연구분야와 동일하게 연결
  const researchText=$("#prof-research-text");
  if(researchText) setTextElement(researchText,interests.join(" · "));

  const b=p.book || {};
  const book=$("#prof-book");
  if(book){
    if(nonEmpty(b.title)||nonEmpty(b.year)||nonEmpty(b.role)){
      const meta=joinParts([b.year,b.role]);
      book.innerHTML=`<div class="book-icon"></div><div>
        <div class="eyebrow">Book</div>
        ${nonEmpty(b.title)?`<h3>${esc(b.title)}</h3>`:""}
        ${meta?`<p>${esc(meta)}</p>`:""}
      </div>`;
      book.hidden=false;
    }else{
      book.innerHTML="";
      book.hidden=true;
    }
  }
}

async function programPage(){
  await applySite();
  const p=await loadJSON("data/program.json",{}) || {};
  const roles=await loadJSON("data/roles.json",[]) || [];
  const curriculum=await loadJSON("data/curriculum.json",[]) || [];
  const training=await loadJSON("data/training.json",[]) || [];
  const conferences=await loadJSON("data/conferences.json",{}) || {};
  const career=await loadJSON("data/career.json",{}) || {};

  setTextElement($("#program-intro-title"),p.intro_title);
  setTextElement($("#program-definition"),p.definition);
  setTextElement($("#neuropsychology-definition"),p.neuropsychology_definition);

  const diseases=cleanList(p.target_diseases);
  setHTMLOrHide($("#target-diseases"),diseases.map(x=>`<span class="chip">${esc(x)}</span>`).join(""));

  const roleItems=roles.filter(x=>nonEmpty(x?.title)||nonEmpty(x?.title_ko)||nonEmpty(x?.description));
  if($("#role-grid")){
    $("#role-grid").innerHTML=roleItems.map((x,i)=>`
      <article class="card role-card">
        <div class="icon">${String(i+1).padStart(2,"0")}</div>
        ${nonEmpty(x.title)?`<h3>${esc(x.title)}</h3>`:""}
        ${nonEmpty(x.title_ko)?`<div class="small-title">${esc(x.title_ko)}</div>`:""}
        ${nonEmpty(x.description)?`<p>${esc(x.description)}</p>`:""}
      </article>`).join("");
  }

  setTextElement($("#assessment-description"),p.assessment_description);
  const functions=cleanList(p.assessment_functions);
  const uses=cleanList(p.assessment_uses);
  setHTMLOrHide($("#assessment-functions"),functions.map(x=>`<li>${esc(x)}</li>`).join(""));
  setHTMLOrHide($("#assessment-uses"),uses.map(x=>`<li>${esc(x)}</li>`).join(""));

  if($("#curriculum-table")){
    $("#curriculum-table").innerHTML=curriculum
      .filter(x=>nonEmpty(x?.code)||nonEmpty(x?.name_ko)||nonEmpty(x?.name_en))
      .map(x=>`<tr>
        <td>${esc(x.code)}</td>
        <td>${nonEmpty(x.name_ko)?`<strong>${esc(x.name_ko)}</strong>`:""}</td>
        <td>${esc(x.name_en)}</td>
      </tr>`).join("");
  }

  if($("#training-grid")){
    $("#training-grid").innerHTML=training
      .filter(x=>nonEmpty(x?.title)||nonEmpty(x?.title_ko)||nonEmpty(x?.frequency)||nonEmpty(x?.location)||cleanList(x?.details).length)
      .map(x=>{
        const details=cleanList(x.details);
        return `<article class="training-card">
          ${nonEmpty(x.title)?`<div class="training-kicker">${esc(x.title)}</div>`:""}
          ${nonEmpty(x.title_ko)?`<h3>${esc(x.title_ko)}</h3>`:""}
          ${nonEmpty(x.frequency)?`<div class="training-meta">${esc(x.frequency)}</div>`:""}
          ${nonEmpty(x.location)?`<p class="training-place">${esc(x.location)}</p>`:""}
          ${details.length?`<ul>${details.map(v=>`<li>${esc(v)}</li>`).join("")}</ul>`:""}
        </article>`;
      }).join("");
  }

  const domestic=cleanList(conferences.domestic);
  const international=cleanList(conferences.international);
  setHTMLOrHide($("#conference-domestic"),domestic.map(x=>`<span class="conference-chip">${esc(x)}</span>`).join(""));
  setHTMLOrHide($("#conference-international"),international.map(x=>`<span class="conference-chip">${esc(x)}</span>`).join(""));

  const traits=cleanList(p.ideal_traits);
  const psych=cleanList(p.recommended_psychology_courses);
  const clinical=cleanList(p.recommended_clinical_courses);
  setHTMLOrHide($("#ideal-traits"),traits.map(x=>`<li>${esc(x)}</li>`).join(""));
  setHTMLOrHide($("#recommended-psychology"),psych.map(x=>`<span class="course-chip">${esc(x)}</span>`).join(""));
  setHTMLOrHide($("#recommended-clinical"),clinical.map(x=>`<span class="course-chip">${esc(x)}</span>`).join(""));

  const pathway=cleanList(career.pathway);
  if($("#career-pathway")){
    $("#career-pathway").innerHTML=pathway.map((x,i)=>`
      <div class="path-step"><div class="path-index">${i+1}</div><span>${esc(x)}</span></div>`).join("");
    $("#career-pathway").hidden=!pathway.length;
  }

  const destinations=(Array.isArray(career.destinations)?career.destinations:[])
    .filter(x=>nonEmpty(x?.category)||cleanList(x?.items).length);
  if($("#career-destinations")){
    $("#career-destinations").innerHTML=destinations.map(x=>{
      const items=cleanList(x.items);
      return `<article class="destination">
        ${nonEmpty(x.category)?`<h3>${esc(x.category)}</h3>`:""}
        ${items.length?`<ul>${items.map(v=>`<li>${esc(v)}</li>`).join("")}</ul>`:""}
      </article>`;
    }).join("");
    $("#career-destinations").hidden=!destinations.length;
  }

  setTextElement($("#consultation-note"),p.consultation_note);
  const consultation=$("#consultation-note")?.closest(".consultation");
  if(consultation) consultation.hidden=!nonEmpty(p.consultation_note);
}

async function publicationsPage(){
  await applySite();
  const pubs=await loadJSON("data/publications.json",[]) || [];
  const search=$("#pub-search"), cat=$("#pub-category");
  const cats=[...new Set(pubs.map(x=>clean(x?.category)).filter(Boolean))];

  if(cat) cat.innerHTML=`<option value="">전체 구분</option>`+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");

  const render=()=>{
    const q=clean(search?.value).toLowerCase(), c=cat?.value || "";
    const list=pubs.filter(x=>
      (!q||`${text(x?.title)} ${text(x?.journal)} ${text(x?.date)}`.toLowerCase().includes(q))
      &&(!c||x.category===c)
    );

    if($("#pub-list")){
      $("#pub-list").innerHTML=list.map(x=>`
        <div class="pub">
          ${nonEmpty(x.date)?`<div class="pub-date">${esc(x.date)}</div>`:"<div></div>"}
          <div>
            ${nonEmpty(x.title)?`<div class="pub-title">${esc(x.title)}</div>`:""}
            ${nonEmpty(x.journal)?`<div class="pub-meta">${esc(x.journal)}</div>`:""}
          </div>
          ${nonEmpty(x.category)?`<span class="tag">${esc(x.category)}</span>`:""}
        </div>`).join("") || emptyBlock("검색 결과가 없습니다.","다른 검색어를 입력해 주세요.");
    }
  };

  search?.addEventListener("input",render);
  cat?.addEventListener("change",render);
  render();
}

async function peoplePage(){
  await applySite();
  const members=await loadJSON("data/members.json",[]) || [];
  const root=$("#member-grid");
  if(!root) return;

  if(!members.length){
    root.innerHTML=emptyBlock("구성원 정보를 준비 중입니다.","Pages CMS에서 구성원을 추가하면 이 페이지에 자동으로 표시됩니다.");
    return;
  }

  root.innerHTML=members.map(x=>`
    <article class="member">
      ${nonEmpty(x.photo)?`<div class="member-photo"><img src="${esc(x.photo)}" alt="${esc(x.name)}"></div>`:""}
      <div class="member-body">
        ${nonEmpty(x.name)?`<h3>${esc(x.name)}</h3>`:""}
        ${nonEmpty(x.role)?`<div class="member-role">${esc(x.role)}</div>`:""}
        ${nonEmpty(x.interests)?`<p>${esc(x.interests)}</p>`:""}
        ${nonEmpty(x.email)?`<p style="margin-top:8px"><a href="mailto:${esc(x.email)}">${esc(x.email)}</a></p>`:""}
      </div>
    </article>`).join("");
}

async function newsPage(){
  await applySite();
  const items=await loadJSON("data/news.json",[]) || [];
  if($("#news-grid")){
    $("#news-grid").innerHTML=items.map(x=>newsCard(x,true)).join("")
      || emptyBlock("등록된 소식이 없습니다.","Pages CMS에서 새 소식을 추가할 수 있습니다.");
  }
}

async function contactPage(){
  await applySite();
  const p=await loadJSON("data/program.json",{}) || {};
  const note=$("#contact-consultation");
  if(note){
    setTextElement(note,p.consultation_note);
    const box=note.closest(".consultation");
    if(box) box.hidden=!nonEmpty(p.consultation_note);
  }
  initExternalMap();
}

function initExternalMap(){
  const preview=$("#map-preview");
  const openButton=$("#map-open-button");
  const modal=$("#map-modal");
  if(!preview||!modal) return;

  const open=()=>{
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("map-open");
  };
  const close=()=>{
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("map-open");
  };

  preview.addEventListener("click",open);
  openButton?.addEventListener("click",e=>{
    e.stopPropagation();
    open();
  });
  preview.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===" "){
      e.preventDefault();
      open();
    }
  });
  $$("[data-map-close]",modal).forEach(el=>el.addEventListener("click",close));
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&modal.classList.contains("open")) close();
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  initNav();
  initYear();
  const page=document.body.dataset.page;
  ({
    home:homePage,
    research:researchPage,
    professor:professorPage,
    program:programPage,
    publications:publicationsPage,
    people:peoplePage,
    news:newsPage,
    contact:contactPage
  }[page]||applySite)();
});
