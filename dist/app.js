const cats=['업무 경험','독서','뉴스','관심사'],folders=['01-HR','02-독서','03-뉴스','04-관심사'];
const categoryPaths={'업무 경험':'/','독서':'/reading/','뉴스':'/hrnews/','관심사':'/interest/'};
const currentPath=location.pathname.replace(/\/+$/,'')||'/';
const routeCategory=Object.keys(categoryPaths).find(c=>(categoryPaths[c].replace(/\/+$/,'')||'/')===currentPath)||'업무 경험';
const careerProfile={company:'나라에이치알',period:'2026.03.30 ~ 2026.09.17',team:'채용관리팀',position:'매니저'};
let notes=[...publishedNotes],category=routeCategory,tag='',companyFilter='',authorFilter='',ratingFilter='',sortBy='latest',page=1,root=null,example=true;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function companyName(n){return n.company||(n.body.match(/^\*\*소속:\*\*\s*([^\r\n]+)/m)?.[1]||'').trim()}
function ratingValue(n){return (n.rating?.match(/[★⭐]/g)||[]).length}
function navigation(){for(const sel of ['#nav','#tabs'])$(sel).innerHTML=cats.map((c,i)=>`<a href="${categoryPaths[c]}" class="${category===c?'active':''}" ${category===c?'aria-current="page"':''}>${sel==='#nav'?['▤　','▥　','▧　','✳　'][i]:''}${c}${sel==='#nav'&&c!=='업무 경험'?`<span>${notes.filter(n=>n.category===c).length}</span>`:''}</a>`).join('')}
function render(){navigation();
const base=notes.filter(n=>n.category===category),tags=[...new Set(base.flatMap(n=>n.tags))];$('#tags').innerHTML=['',...tags].map(t=>`<button class="${tag===t?'active':''}" data-tag="${esc(t)}">${t?'# '+esc(t):'모든 태그'}</button>`).join('');document.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{tag=b.dataset.tag;page=1;render()});
$('#tags').hidden=category==='업무 경험';
const isReading=category==='독서';
$('#sort-filter-label').hidden=category==='업무 경험';
$('#sort-filter').value=sortBy;
$('#company-filter-label').hidden=category!=='업무 경험';
const companies=[...new Set(base.map(companyName).filter(Boolean))].sort();
$('#company-filter').innerHTML='<option value="">전체 회사</option>'+companies.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
$('#company-filter').value=companyFilter;
$('#author-filter-label').hidden=!isReading;$('#rating-filter-label').hidden=!isReading;
const authors=[...new Set(base.map(n=>n.author).filter(Boolean))].sort();
$('#author-filter').innerHTML='<option value="">전체 저자</option>'+authors.map(a=>`<option value="${esc(a)}">${esc(a)}</option>`).join('');
$('#author-filter').value=authorFilter;$('#rating-filter').value=ratingFilter;
const q=$('#search').value.toLowerCase(),list=base.filter(n=>(category!=='업무 경험'||!companyFilter||companyName(n)===companyFilter)&&(!tag||n.tags.includes(tag))&&(!isReading||!authorFilter||n.author===authorFilter)&&(!isReading||!ratingFilter||ratingValue(n)===Number(ratingFilter))&&[n.title,n.body,...n.tags].join(' ').toLowerCase().includes(q)).sort((a,b)=>sortBy==='oldest'?a.date.localeCompare(b.date):sortBy==='rating'?(ratingValue(b)-ratingValue(a)||b.date.localeCompare(a.date)):b.date.localeCompare(a.date));
$('#heading').firstChild.textContent=category+' ';$('#count').textContent=list.length;
const totalPages=Math.max(1,Math.ceil(list.length/10));page=Math.min(page,totalPages);
$('#grid').innerHTML=list.slice((page-1)*10,page*10).map(n=>{const i=Math.max(0,cats.indexOf(n.category));return `<button class="card${n.category==='업무 경험'?' experience-card':''}" data-id="${esc(n.id)}">${n.category==='업무 경험'?'':`<div class="cover c${i}">${n.cover?`<img src="${esc(n.cover)}" alt="${esc(n.title)} 책 표지" loading="lazy">`:`<strong>${['People & possibilities.','Between the pages.','A changing world.','Stay curious.'][i]}</strong><span>${['◫','▥','↗','✳'][i]}</span>`}</div>`}<div class="cardbody"><div class="meta"><span>${esc(n.category==='업무 경험'?companyName(n)||n.category:n.category)}${n.id.startsWith('sample')?' · EXAMPLE':''}${n.author?' · '+esc(n.author)+' 저':''}${n.rating?' <span class="book-rating" aria-label="별점 '+ratingValue(n)+'점">'+esc(n.rating)+'</span>':''}</span>${n.category==='업무 경험'?'':`<span>${esc(n.date)}</span>`}</div><div class="title-line"><h3>${esc(n.title)}</h3><div class="cardtags">${n.tags.map(t=>'#'+esc(t)).join('　')}</div></div><p>${esc(n.summary||n.body)}</p></div></button>`}).join('')||'<div class="empty">아직 기록이 없습니다.</div>';
document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const n=notes.find(n=>n.id===b.dataset.id);openNote(n)});
$('#pagination').innerHTML=`<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">← 이전</button>${Array.from({length:totalPages},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page" class="active"':''}>${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===totalPages?'disabled':''} aria-label="다음 페이지">다음 →</button>`;
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.page);render();$('#heading').scrollIntoView({behavior:'smooth',block:'start'})});}

function sourceLink(n){try{const u=new URL(n.sourceUrl);if(!['http:','https:'].includes(u.protocol))return '';const label=n.category==='독서'?'책 정보 보기':n.category==='뉴스'?'기사 원문 보기':'관련 원본 보기';return `<p class="source-link"><a href="${esc(u.href)}" target="_blank" rel="noopener noreferrer">${label} ↗ <small>${esc(u.hostname)}</small></a></p>`}catch{return ''}}
function experienceContent(n){
if(n.category!=='업무 경험')return '';
const body=n.body.replace(/\r\n/g,'\n').replace(/^\*\*기간:\*\*[^\n]*/m,line=>companyName(n)==='나라에이치알'?'**기간:** '+careerProfile.period+'  ':line),headings=[...body.matchAll(/^###\s+(상황|과제|행동|결과)\s*\((Situation|Task|Action|Result)\)\s*$/gm)];
if(headings.length!==4||headings.map(h=>h[2]).join()!=='Situation,Task,Action,Result')return '';
const result=body.match(/^\*\*핵심 성과:\*\*\s*([\s\S]*)$/m),end=result?result.index:body.length;
const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
const blocks=s=>s.trim().split(/\n\s*\n/).filter(Boolean).map(p=>{const lines=p.split('\n');return /^\*\*[①②③].+\*\*$/.test(p)?'<h4 class="action-subheading">'+inline(p)+'</h4>':lines.every(l=>/^[-*]\s/.test(l))?'<ul>'+lines.map(l=>'<li>'+inline(l.replace(/^[-*]\s+/,''))+'</li>').join('')+'</ul>':'<p>'+inline(p).replace(/\n/g,'<br>')+'</p>'}).join('');
const clean=s=>s.replace(/\n*---\s*$/,'').trim();
return `<div class="experience-intro">${blocks(body.slice(0,headings[0].index).replace(/^#\s+.+\n/,''))}</div><div class="star-grid">${headings.map((h,i)=>`<section class="star-section"><h3><span>${'STAR'[i]}</span>${h[1]}<small>${h[2]}</small></h3>${blocks(clean(body.slice(h.index+h[0].length,i<3?headings[i+1].index:end)))}</section>`).join('')}</div>${result?`<section class="star-outcome"><h3>핵심 성과</h3>${blocks(result[1])}</section>`:''}`;
}
function openNote(n){const experience=experienceContent(n);$('#detail').classList.toggle('experience-detail',Boolean(experience));$('#detailbody').innerHTML=`<div class="eyebrow">${esc(n.category==='업무 경험'?companyName(n)||n.category:n.category)}</div><h2>${esc(n.title)}</h2><p class="detail-meta">${[n.category==='업무 경험'?'':n.date,n.author?n.author+' 저':'',n.rating,n.tags.join(' / ')].filter(Boolean).map(esc).join(' · ')}</p>${sourceLink(n)}${experience||`<div class="note-body${n.html?' article-body':''}">${n.html||esc(n.body)}</div>`}`;$('#detail').showModal();$('#detail').scrollTop=0}
function parse(text,path){const m=text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/),meta={};if(m)for(const l of m[1].split(/\r?\n/)){const p=l.indexOf(':');if(p>0)meta[l.slice(0,p).trim()]=l.slice(p+1).trim()}let body=m?text.slice(m[0].length):text;const inferred=folders.findIndex(f=>f&&path.includes(f));return{id:path,title:meta.title||body.match(/^#\s+(.+)$/m)?.[1]||path.split('/').pop().replace(/\.(md|txt)$/i,''),category:meta.category==='HR 포트폴리오'?'업무 경험':cats.includes(meta.category)?meta.category:cats[inferred>=0?inferred:3],date:/^\d{4}-\d{2}-\d{2}$/.test(meta.date)?meta.date:'',tags:(meta.tags||'').split(',').map(t=>t.trim()).filter(Boolean),sourceUrl:meta.sourceUrl||meta.url||'',body:body.replace(/^#\s+.+\r?\n/,'').trim()}}
$('#company-filter').onchange=e=>{companyFilter=e.target.value;page=1;render()};
$('#author-filter').onchange=e=>{authorFilter=e.target.value;page=1;render()};
$('#rating-filter').onchange=e=>{ratingFilter=e.target.value;page=1;render()};
$('#sort-filter').onchange=e=>{sortBy=e.target.value;page=1;render()};
$('#reset-filters').onclick=()=>{companyFilter='';authorFilter='';ratingFilter='';sortBy='latest';tag='';$('#search').value='';page=1;render()};
$('#search').oninput=()=>{page=1;render()};
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
const careerCompanies=[{"company":"나라에이치알","period":"2026.03.30 ~ 2026.09.17","team":"채용관리팀","position":"매니저","scope":"채용공고 운영 · 약 45명 근로자 관리 · 고객사 커뮤니케이션 · HR 업무 개선","order":["hr-ai-job-posting-generator","hr-applicant-db-cloud","hr-worker-guidance","hr-schedule-process-standardization","hr-stakeholder-communication","hr-employment-recognition-risk"]},{"company":"가천대학교","period":"2025년 2월 ~ 2026년 1월","team":"인문대학 학과 사무실","position":"학과 행정조교","scope":"교원 공개채용 지원 · 프로그램·행사 운영 · 학생 프로젝트 관리 · 예산 집행·정산 · 학사 데이터 관리","order":["gachon-faculty-recruitment","gachon-promotion-contest","gachon-ebook-project","gachon-budget-academic-data"]}];
function profileFor(n){return careerCompanies.find(c=>c.company===companyName(n))||careerProfile}
function renderCompany(profile){
const experienceNotes=notes.filter(n=>n.category==='업무 경험'&&companyName(n)===profile.company);
const order=profile.order;
experienceNotes.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));
return `<section class="company-career"><div class="company-heading"><h3>${esc(profile.company)}</h3><div class="company-meta"><span>${esc(profile.period)}</span><span>${esc(profile.team)}</span><span>${esc(profile.position)}</span></div></div><p class="career-scope">${esc(profile.scope)}</p><ol class="experience-list">${experienceNotes.map(n=>`<li><a href="/experience/${encodeURIComponent(n.id)}/" data-experience="${esc(n.id)}" aria-haspopup="dialog"><div><h4>${esc(n.title)}</h4><p>${esc(n.summary||'')}</p></div><span class="entry-arrow" aria-hidden="true">↗</span></a></li>`).join('')}</ol></section>`;
}
function renderCareer(){
$('#career').innerHTML='<div class="eyebrow">CAREER HISTORY</div><h2>경력기술서</h2>'+careerCompanies.map(renderCompany).join('');
document.querySelectorAll('[data-experience]').forEach(a=>a.onclick=e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();openNote(notes.find(n=>n.id===a.dataset.experience))});
}
function setupPage(){
const isDetail=currentPath.startsWith('/experience/'),isHome=currentPath==='/'||(!Object.values(categoryPaths).some(p=>p.replace(/\/+$/,'')===currentPath)&&!isDetail);
category=isHome||isDetail?'업무 경험':routeCategory;
render();
$('.collection').hidden=isHome||isDetail;
$('#profile').hidden=!isHome;$('#career').hidden=!isHome;$('#experience-page').hidden=!isDetail;
document.body.classList.toggle('career-detail-view',isDetail);
if(isHome){renderCareer();document.title='강동인 · 자기소개와 경력기술서'}
else if(isDetail){const id=decodeURIComponent(currentPath.split('/')[2]||''),n=notes.find(n=>n.id===id&&n.category==='업무 경험');
$('#experience-page').innerHTML=n?`<div class="experience-page-toolbar"><a href="/#career">← 경력기술서</a><a class="detail-back" href="/#career" aria-label="경력기술서로 돌아가기">×</a></div><div class="experience-page-content"><div class="eyebrow">${esc(profileFor(n).company)} / ${esc(profileFor(n).team)} / ${esc(profileFor(n).position)}</div><h1>${esc(n.title)}</h1>${experienceContent(n)}<a class="bottom-back" href="/#career">← 경력기술서 목록으로</a></div>`:'<h1>업무 경험을 찾을 수 없습니다.</h1><a href="/#career">경력기술서로 돌아가기</a>';
document.title=n?n.title+' · 강동인':'업무 경험 · 강동인';
}else{document.title=category+' · 강동인의 기록'}
const linkedNote=notes.find(n=>n.id===location.hash.slice(1));
if(linkedNote){const target=categoryPaths[linkedNote.category];if(linkedNote.category==='업무 경험'){location.replace('/experience/'+encodeURIComponent(linkedNote.id)+'/');return}if(category!==linkedNote.category||isHome){location.replace(target+location.search+location.hash);return}openNote(linkedNote)}
}
setupPage();
