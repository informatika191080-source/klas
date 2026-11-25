const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const values=new Map(),c={window:{},location:{hash:'#data-processes'},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}};
vm.createContext(c);vm.runInContext(fs.readFileSync('5/data-dispatch.js','utf8'),c);const api=c.window.CyfroData;
const s=api.defaults();assert(api.validate(s));assert(api.issue(s));
function advance(){assert.equal(api.issue(s),'');s.done.push(s.phase);s.stage=Math.floor(s.done.length/2);s.finished=s.done.length===6;s.phase=api.phases[Math.min(s.done.length,5)];assert(api.validate(s));}
s.record={time:'13:00',place:'museum',duration:'45'};assert(api.issue(s).includes('Старий'));s.record.time='14:30';advance();
s.route={sender:'olya',channel:'mobile',receiver:'marta'};assert(api.issue(s).includes('надішли'));s.routeSent=true;advance();
s.end='14:75';assert(api.issue(s));s.end='15:15';assert(api.issue(s).includes('Створи'));s.processed=true;advance();
s.inspected=true;s.board='old';assert(api.issue(s).includes('збережи'));s.archive='new';assert(api.issue(s).includes('Передай'));s.board='new';advance();
s.picked=['clay','paper','keyboard'];assert(api.issue(s));s.picked=['clay','paper','flash'];s.seen=['clay','paper','flash'];s.periods={clay:'ancient',paper:'continuing',flash:'digital'};advance();
s.draft.members=['Дослідник','Редактор','Дизайнер',''];s.draft.captions={clay:'Запис про кількість зерна у сховищі.',paper:'Лист другові із запрошенням на виставку.',flash:'Цифрова фотографія нашої виставки.'};advance();assert.equal(s.done.length,6);assert(s.finished);
const corrupt=JSON.parse(JSON.stringify(s));corrupt.board='old';assert.throws(()=>api.validate(corrupt));corrupt.board='new';corrupt.done=['record','route','publish'];assert.throws(()=>api.validate(corrupt));
for(const [path,value] of [['duration',45],['time',{}]]){const t=JSON.parse(JSON.stringify(s));t.record[path]=value;assert.throws(()=>api.validate(t));}
const pending=api.defaults();pending.record={time:'14:30',place:'museum',duration:'45'};pending.pending=true;assert(api.validate(pending));pending.record.time='13:00';assert.throws(()=>api.validate(pending));
const hostile=JSON.parse(JSON.stringify(s));hostile.draft.title='<img src=x onerror=alert(1)>';hostile.draft.captions.paper='</p><script>alert(1)</script>';
const html=api.deckHTML(hostile);assert(!html.includes('<img src=x'));assert(!html.includes('<script>alert(1)'));assert.equal((html.match(/<section id="slide-/g)||[]).length,4);assert(html.includes('Давній світ'));assert(html.includes('Музей історії комп’ютерів'));
vm.runInContext(fs.readFileSync('5/academy.js','utf8'),c);const academy=c.window.CyfroAcademy;const good=academy.validateImport({'data-processes':s});academy.importProgress(good);assert.equal(academy.exportProgress()['data-processes'].done.length,6);assert.equal(academy.catalog().find(x=>x.id==='data-processes').number,'4');assert.throws(()=>academy.validateImport({'data-processes':corrupt}));
vm.runInContext(fs.readFileSync('5/progress-report.js','utf8'),c);const entry=c.window.CyfroProgress.lessonEntry({id:'data-processes',title:'Пригода 4'},s);assert.equal(entry.total,6);assert.equal(entry.done,6);assert(entry.completed);const partial={...s,stage:1,finished:false,done:['record','route','process']};assert.equal(c.window.CyfroProgress.lessonEntry({id:'data-processes'},partial).done,3);
console.log('PASS: six lesson-4 outcomes, stale-data diagnosis, real transmission gate, invalid save rejection, pending confirmation validation, four-slide export escaping, backup and progress integration.');
