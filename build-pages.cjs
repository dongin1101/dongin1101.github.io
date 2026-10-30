const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dist=path.join(__dirname,'dist');
const shell=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const sandbox={};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(dist,'published.js'),'utf8')+';this.records=publishedNotes;',sandbox);
const routes=[['reading','독서'],['hrnews','뉴스'],['interest','관심사'],...sandbox.records.filter(n=>n.category==='업무 경험').map(n=>['experience/'+n.id,n.title])];
for(const [route,title]of routes){const dir=path.join(dist,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),shell.replace(/<title>.*?<\/title>/,'<title>'+title.replace(/&/g,'&amp;').replace(/</g,'&lt;')+' · 강동인</title>'));}
const legacy=path.join(dist,'hr-notebook');fs.mkdirSync(legacy,{recursive:true});
fs.writeFileSync(path.join(legacy,'index.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><title>강동인 포트폴리오로 이동</title><a href="/">새 주소로 이동</a><script>location.replace("/"+location.search+location.hash)</script></html>');
console.log('Built '+routes.length+' pages plus legacy redirect.');

