const categoryPaths = {'독서': '/reading/', '뉴스': '/hrnews/', '관심사': '/interest/'};
const cats = Object.keys(categoryPaths);
const categoryLabels = {'독서': '독서', '뉴스': 'HR 뉴스', '관심사': '관심사'};
const currentPath = location.pathname.replace(/\/+$/, '') || '/';
const category = cats.find(c => categoryPaths[c].slice(0, -1) === currentPath);
const notes = publishedNotes;
let tag = '', authorFilter = '', ratingFilter = '', sortBy = 'latest', page = 1;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ratingValue(n){return (n.rating?.match(/[★⭐]/g)||[]).length}
function navigation(){for(const sel of ['#nav','#tabs'])$(sel).innerHTML=cats.map((c,i)=>`<a href="${categoryPaths[c]}" class="${category===c?'active':''}" ${category===c?'aria-current="page"':''}>${sel==='#nav'?['▥　','▧　','✳　'][i]:''}${categoryLabels[c]}${sel==='#nav'?`<span>${notes.filter(n=>n.category===c).length}</span>`:''}</a>`).join('')}
function render(){navigation();
const base=notes.filter(n=>n.category===category),tags=[...new Set(base.flatMap(n=>n.tags))];$('#tags').innerHTML=['',...tags].map(t=>`<button class="${tag===t?'active':''}" data-tag="${esc(t)}">${t?'# '+esc(t):'모든 태그'}</button>`).join('');document.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{tag=b.dataset.tag;page=1;render()});
const isReading=category==='독서';
$('#sort-filter').value=sortBy;
$('#author-filter-label').hidden=!isReading;$('#rating-filter-label').hidden=!isReading;
const authors=[...new Set(base.map(n=>n.author).filter(Boolean))].sort();
$('#author-filter').innerHTML='<option value="">전체 저자</option>'+authors.map(a=>`<option value="${esc(a)}">${esc(a)}</option>`).join('');
$('#author-filter').value=authorFilter;$('#rating-filter').value=ratingFilter;
const q=$('#search').value.toLowerCase(),list=base.filter(n=>(!tag||n.tags.includes(tag))&&(!isReading||!authorFilter||n.author===authorFilter)&&(!isReading||!ratingFilter||ratingValue(n)===Number(ratingFilter))&&[n.title,n.body,...n.tags].join(' ').toLowerCase().includes(q)).sort((a,b)=>sortBy==='oldest'?a.date.localeCompare(b.date):sortBy==='rating'?(ratingValue(b)-ratingValue(a)||b.date.localeCompare(a.date)):b.date.localeCompare(a.date));
$('#heading').firstChild.textContent=categoryLabels[category]+' ';$('#count').textContent=list.length;
const totalPages=Math.max(1,Math.ceil(list.length/10));page=Math.min(page,totalPages);
$('#grid').innerHTML=list.slice((page-1)*10,page*10).map(n=>{return `<button class="card" data-id="${esc(n.id)}">${n.category !== '독서'?'':`<div class="cover c1">${n.cover?`<img src="${esc(n.cover)}" alt="${esc(n.title)} 책 표지" loading="lazy">`:`<strong>Between the pages.</strong><span>▥</span>`}</div>`}<div class="cardbody"><div class="meta"><span>${esc(categoryLabels[n.category])}${n.id.startsWith('sample')?' · EXAMPLE':''}${n.author?' · '+esc(n.author)+' 저':''}${n.rating?' <span class="book-rating" aria-label="별점 '+ratingValue(n)+'점">'+esc(n.rating)+'</span>':''}</span><span>${esc(n.date)}</span></div><div class="title-line"><h3>${esc(n.title)}</h3><div class="cardtags">${n.tags.map(t=>'#'+esc(t)).join('　')}</div></div><p>${esc(n.summary||n.body)}</p></div></button>`}).join('')||'<div class="empty">아직 기록이 없습니다.</div>';
document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const n=notes.find(n=>n.id===b.dataset.id);openNote(n)});
$('#pagination').innerHTML=`<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="이전 페이지">← 이전</button>${Array.from({length:totalPages},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page" class="active"':''}>${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===totalPages?'disabled':''} aria-label="다음 페이지">다음 →</button>`;
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.page);render();$('#heading').scrollIntoView({behavior:'smooth',block:'start'})});}

function sourceLink(n){try{const u=new URL(n.sourceUrl);if(!['http:','https:'].includes(u.protocol))return '';const label=n.category==='독서'?'책 정보 보기':n.category==='뉴스'?'기사 원문 보기':'관련 원본 보기';return `<p class="source-link"><a href="${esc(u.href)}" target="_blank" rel="noopener noreferrer">${label} ↗ <small>${esc(u.hostname)}</small></a></p>`}catch{return ''}}
function openNote(n){$('#detailbody').innerHTML=`<div class="eyebrow">${esc(categoryLabels[n.category])}</div><h2>${esc(n.title)}</h2><p class="detail-meta">${[n.date,n.author?n.author+' 저':'',n.rating,n.tags.join(' / ')].filter(Boolean).map(esc).join(' · ')}</p>${sourceLink(n)}<div class="note-body${n.html?' article-body':''}">${n.html||esc(n.body)}</div>`;$('#detail').showModal();$('#detail').scrollTop=0}
$('#author-filter').onchange=e=>{authorFilter=e.target.value;page=1;render()};
$('#rating-filter').onchange=e=>{ratingFilter=e.target.value;page=1;render()};
$('#sort-filter').onchange=e=>{sortBy=e.target.value;page=1;render()};
$('#reset-filters').onclick=()=>{authorFilter='';ratingFilter='';sortBy='latest';tag='';$('#search').value='';page=1;render()};
$('#search').oninput=()=>{page=1;render()};
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());

if (category) {
  $('.collection').hidden = false;
  render();
} else {
  $('#home').hidden = false;
  navigation();
  $('#latest').innerHTML = cats.map(c => {
    const path = categoryPaths[c];
    const label = categoryLabels[c];
    const latest = notes.filter(n => n.category === c)
      .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    const entries = latest.map(note =>
      '<li><time datetime="' + esc(note.date) + '">' + esc(note.date) + '</time><br>' +
      '<a href="' + path + '#' + encodeURIComponent(note.id) + '">' + esc(note.title) + '</a></li>'
    ).join('');
    const list = entries ? '<ul>' + entries + '</ul>' : '<p>아직 기록이 없습니다.</p>';
    return '<section><h2>' + label + '</h2>' + list +
      '<a class="archive-more" href="' + path + '" aria-label="' + label + ' 자세히">자세히</a></section>';
  }).join('');
}
const linkedNote = notes.find(n => encodeURIComponent(n.id) === location.hash.slice(1) || n.id === location.hash.slice(1));
if (linkedNote) {
  if (category === linkedNote.category) openNote(linkedNote);
  else location.replace(categoryPaths[linkedNote.category] + location.search + location.hash);
}
