/* Reuse fully validated lesson outcomes from the existing gate tests. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function fixture(file,expression){const c={require,URL,console:{log(){}}};vm.createContext(c);vm.runInContext(fs.readFileSync('tests/'+file+'.cjs','utf8')+'\nglobalThis.fixture='+expression,c);return JSON.parse(JSON.stringify(c.fixture));}
const fixtures={...fixture('global-network',"({'web-search':first,'media-detective':second})"),...fixture('data-dispatch',"({'data-processes':s})")};
const values=new Map();let failKey;
const c={window:{},URL,location:{hash:'#topics'},localStorage:{getItem:k=>values.get(k)||null,setItem(k,v){if(failKey===k){failKey=null;throw Error('quota');}values.set(k,v)},removeItem:k=>values.delete(k)}};
vm.createContext(c);for(const f of ['data-dispatch','global-network','download-rescue','academy','progress-report','replay'])vm.runInContext(fs.readFileSync('5/'+f+'.js','utf8'),c);
const {CyfroDownloads:d,CyfroAcademy:a,CyfroReplay:r,CyfroProgress:p}=c.window;
const download=d.defaults(),m=d.materials[0];Object.assign(download,{started:true,theme:m.id,reviewed:['author','license','file'],downloadRequested:true,located:true,location:'project-images',filename:'Мій експонат.svg',filenameDraft:'Мій експонат.svg',renamed:true,excerpt:m.text,title:'Моя цікава виставка',intro:'Запрошую дослідити цей експонат і придумати власне запитання до нього.',credit:m.author,source:m.url,license:'CC BY 4.0',changes:'Без змін',stage:3,phase:'done',finished:true});d.validate(download);fixtures['download-rescue']=download;
for(const [id,finished]of Object.entries(fixtures)){
 a.importProgress({[id]:finished});const def=a.catalog().find(x=>x.id===id),before=values.get(def.storageKey);
 // A failed save must retain the original work and archive.
 const oldArchive=values.get(r.KEY);failKey=def.storageKey;assert.throws(()=>r.restartLesson(id));assert.equal(values.get(def.storageKey),before);assert.equal(values.get(r.KEY),oldArchive);
 const fresh=r.restartLesson(id);assert.equal(fresh.stage,0);assert.equal(fresh.started,true);assert.equal(fresh.finished,false);assert.equal(r.completed(id),true);assert(a.lessonStatus(id).finished);
 assert.equal(JSON.stringify(r.exportProgress()[id]),before,'Preserve the entire prior product');
 const entry=p.lessonEntry(def,fresh,r.exportProgress()[id]);assert(entry.completed);assert(entry.replaying);assert.equal(entry.done,entry.total);assert.equal(entry.current,0);
 assert.throws(()=>r.restartLesson(id),'Cannot erase an unfinished attempt');
}
const archive=JSON.stringify(r.exportProgress());r.reset();assert.equal(r.completed('data-processes'),false);r.importProgress(JSON.parse(archive));assert(r.completed('data-processes'));
assert.deepEqual(JSON.parse(JSON.stringify(r.validate(undefined))),{});assert.throws(()=>r.validate({'data-processes':c.window.CyfroData.defaults()}));assert.throws(()=>r.validate({unknown:{stage:3,finished:true}}));
// All city controllers restart while keeping awarded results and diploma date.
c.state={results:{},mNew:{},finishedAt:'2026-11-25T10:00:00.000Z',finale:{done:true}};for(let i=0;i<8;i++)for(let j=0;j<3;j++)c.state.results[(i+1)+'-'+j]=j!==1;
c.persist=()=>{};c.start=i=>{c.state.screen='game';c.state.ticket=i};c.newMissionState=i=>c.state.mNew[i]||(c.state.mNew[i]={stage:'intro'});const results=JSON.stringify(c.state.results);
for(let i=0;i<8;i++){r.restartCity(i);const current=i===0?c.state.m1:i===1?c.state.m2:i===2?c.state.m3:i===5?c.state.m6:c.state.mNew[i];assert.equal(current.stage,'intro');assert.equal(current.replaying,true);assert.equal(JSON.stringify(c.state.results),results);assert.equal(c.state.finishedAt,'2026-11-25T10:00:00.000Z');assert(c.state.finale.done);}
assert.throws(()=>r.restartCity(8));delete c.state.results['1-0'];assert.throws(()=>r.restartCity(0));
a.reset();assert.equal(values.has(r.KEY),false);for(const id of r.supported)assert.equal(a.lessonStatus(id).finished,false);
if(process.env.REPLAY_FIXTURES)fs.writeFileSync(process.env.REPLAY_FIXTURES,JSON.stringify(fixtures));
console.log('PASS: four complete-product replay archives, failed-save rollback, retained achievements, backup validation/reset and all eight city restarts without loss of results/diploma.');
