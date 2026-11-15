const fs=require('node:fs');
const path=require('node:path');
const dist=path.join(__dirname,'dist');
const shell=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const routes=[['reading','독서'],['hrnews','HR 뉴스'],['hrstudy','HR Study'],['interest','관심사']];
for(const [route,title]of routes){const dir=path.join(dist,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),shell.replace(/<title>.*?<\/title>/,'<title>'+title.replace(/&/g,'&amp;').replace(/</g,'&lt;')+' · 강동인</title>'));}
const redirect = '<!doctype html><html lang="ko"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><title>HR Notebook 홈으로 이동</title><a href="/">홈으로 이동</a></html>\n';
const oldExperienceRoot = path.join(dist, 'experience');
for (const entry of fs.readdirSync(oldExperienceRoot, {withFileTypes: true})) {
  if (entry.isDirectory()) fs.writeFileSync(path.join(oldExperienceRoot, entry.name, 'index.html'), redirect);
}
fs.writeFileSync(path.join(oldExperienceRoot, 'index.html'), redirect);
fs.writeFileSync(path.join(dist, 'hr-notebook', 'index.html'), redirect);
console.log('Built archive pages and legacy redirects.');
