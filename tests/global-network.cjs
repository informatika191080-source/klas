/* Real lesson gates and backup integration, including adversarial/partial progress. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const values=new Map(),context={window:{},URL,localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},location:{hash:'#topics'}};
vm.createContext(context);vm.runInContext(fs.readFileSync('5/global-network.js','utf8'),context);vm.runInContext(fs.readFileSync('5/academy.js','utf8'),context);
const a=context.window.CyfroGlobal,academy=context.window.CyfroAcademy;
const clone=x=>JSON.parse(JSON.stringify(x));
for(const q of ['українські вчені-природознавці біографії','Життєписи природознавців України','Українські дослідники природничих наук біографії'])assert.equal(a.queryIssue(q),'',q);
for(const q of ['вчені','біографії природознавців','українські біографії','українські природознавці'])assert(a.queryIssue(q));
for(const url of ['javascript:alert(1)','data:text/html,test','https://user:secret@example.org','not a url','https://example.org/article','https://model.example/article'])assert.equal(a.httpURL(url),false);
const first=a.defaults('web-search');assert(a.issue('web-search',first));assert(a.validate('web-search',first));
function advance(id,s,p){assert.equal(s.phase,p);assert.equal(a.issue(id,s),'',p);s.done.push(p);s.stage=Math.floor(s.done.length/2);s.finished=s.done.length===6;s.phase=a.phases[id][Math.min(s.done.length,5)];assert(a.validate(id,s));}
Object.assign(first.choices,{browser:'program',engine:'service',web:'service'});advance('web-search',first,'tools');
first.page='home';assert(a.issue('web-search',first));first.page='catalog';first.address='https://biblioteka.example/catalog';advance('web-search',first,'address');
first.query='українські природознавці біографії';assert(a.issue('web-search',first),'Typing alone is not a search');first.searched=first.query;advance('web-search',first,'query');
Object.assign(first.choices,{result:'catalog',resultWhy:'fit'});assert(a.issue('web-search',first),'Source inspection cannot be skipped');first.seen.push('catalog','references');advance('web-search',first,'results');
first.mode='images';first.seen.push('image','image-source');first.picked.imageDetails=['author','terms','source'];first.choices.imageWhy='credit';advance('web-search',first,'images');
Object.assign(first.choices,{plan1:'query',plan2:'compare',plan3:'conclude'});advance('web-search',first,'plan');assert.equal(first.stage,3);
const second=a.defaults('media-detective');Object.assign(second.choices,{claim0:'fact',claim1:'opinion',claim2:'unverified'});advance('media-detective',second,'claims');
second.picked.flags=['author','date','evidence'];assert(a.issue('media-detective',second));second.seen.push('author','date','evidence');advance('media-detective',second,'signals');
second.seen.push('official','calendar','repost','copy');second.picked.sources=['repost','copy'];second.choices.verdict='closed';assert(a.issue('media-detective',second),'Reposts are not independent evidence');second.picked.sources=['official','calendar'];advance('media-detective',second,'compare');
Object.assign(second.choices,{date:'current',ad:'evidence',wiki:'sources'});advance('media-detective',second,'context');
second.seen.push('reverse');second.choices.reverse='origin';assert(a.issue('media-detective',second),'Similarity is insufficient without provenance');second.seen.push('origin');advance('media-detective',second,'reverse');
Object.assign(second.draft,{query:'Дажбог українські міфи',source1:'https://source-one.edu/article',source2:'https://source-one.edu/other',conclusion:'У міфологічному сюжеті описують уявлення людей. Походження цих відомостей ще потребує обговорення.',note:'Порівняно автора та наведені джерела.'});second.picked.research=['read','compared','myth'];assert(a.issue('media-detective',second),'Same website is not enough');second.draft.source2='https://source-two.edu/article';advance('media-detective',second,'dossier');
// These addresses are test fixtures, not evaluated or recommended research sources.
assert(a.exportText('media-detective',second).includes('Зміст і незалежність джерел потребують обговорення.'));
const forged=clone(first);forged.choices.browser='network';assert.throws(()=>a.validate('web-search',forged));
const skipped=a.defaults('media-detective');skipped.stage=3;skipped.finished=true;assert.throws(()=>a.validate('media-detective',skipped));
for(const mutate of [x=>x.seen.push('unknown'),x=>x.choices.unknown='',x=>x.draft.note='x'.repeat(701),x=>x.picked.flags=['date','date'],x=>x.done.reverse(),x=>x.errors=-1]){const x=clone(second);mutate(x);assert.throws(()=>a.validate('media-detective',x));}
const input={'web-search':first,'media-detective':second};academy.importProgress(academy.validateImport(input));assert.equal(academy.exportProgress()['media-detective'].draft.note,second.draft.note);assert(academy.lessonStatus('web-search').finished);
academy.reset();assert.equal(academy.exportProgress()['web-search'].stage,undefined);
console.log('PASS: 12 task gates, search semantics, source inspection, independent evidence, image provenance, research completeness, corrupt-save rejection and combined backup/reset.');
