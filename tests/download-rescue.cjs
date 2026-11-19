const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const values=new Map(),c={window:{},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},location:{hash:'#topics'}};vm.createContext(c);
for(const f of ['download-rescue','global-network','academy'])vm.runInContext(fs.readFileSync('5/'+f+'.js','utf8'),c);
const a=c.window.CyfroDownloads,academy=c.window.CyfroAcademy;
for(const theme of ['space','forest']){
 const s=a.defaults(),m=a.materials.find(x=>x.id===theme);assert(a.issue(s));s.theme=theme;assert(a.issue(s));s.reviewed=['author','license','file'];assert(a.issue(s));s.downloadRequested=true;assert.equal(a.issue(s),'');
 s.stage=1;s.phase='organize';assert(a.validate(s));assert(a.issue(s));s.located=true;s.location='project-images';assert(a.issue(s));s.filename='Мій експонат.svg';s.filenameDraft=s.filename;s.renamed=true;s.excerpt=m.text;assert.equal(a.issue(s),'');
 for(const name of ['image.svg','moon.svg.exe','moon.exe','../moon.svg','x.svg','moon.jpg'])assert(a.filenameIssue(name),name);
 assert.equal(a.filenameIssue('Місяць 01.svg'),'');s.stage=2;s.phase='exhibit';assert(a.validate(s));s.title='Моя цікава виставка';s.intro='Запрошую дослідити цей експонат і придумати власне запитання до нього.';s.credit='Автор усього — я';s.source=m.url;s.license='CC BY 4.0';s.changes='Без змін';assert(a.issue(s));s.credit=m.author;assert.equal(a.issue(s),'');
 s.stage=3;s.phase='done';s.finished=true;assert(a.validate(s));academy.importProgress(academy.validateImport({'download-rescue':s}));assert(academy.lessonStatus('download-rescue').finished);assert.equal(academy.exportProgress()['download-rescue'].theme,theme);
 for(const edit of [x=>x.location='downloads',x=>x.excerpt='',x=>x.credit='Я і '+m.author,x=>x.reviewed=['author'],x=>x.license='CC',x=>x.theme='unknown',x=>x.intro='x'.repeat(1201),x=>x.finished=false]){const x=JSON.parse(JSON.stringify(s));edit(x);assert.throws(()=>a.validate(x));}
 const unsafe={...s,title:'<script>alert(1)</script>',intro:'<img src=x onerror=alert(1)> Це тест екранування.'};const html=a.exportHTML(unsafe);assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(html.includes('data:image/svg+xml'));assert(html.includes(m.licenseURL));assert(html.includes(m.url));
}
academy.reset();assert.equal(academy.exportProgress()['download-rescue'].stage,undefined);
console.log('PASS: both quest branches, investigation/download gates, organize-before-create, file extensions, credit repair, offline export escaping, corrupt-save rejection, combined backup/reset.');
