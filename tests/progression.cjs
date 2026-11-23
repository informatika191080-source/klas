/* Run with node tests/progression.cjs. Actual mission handlers, isolated from UI rendering. */
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('5/game.html','utf8');
const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',className:'',textContent:''});return nodes.get(id);};
const context={window:{},document:{getElementById:node},state:{screen:'game',ticket:0,step:0,results:{}},key:(i,j)=>`${i+1}-${j}`,persist(){},render(){},beep(){},toast(){}};
let pendingAck=null;context.window.CyfroUX={pass(p){assert.equal(pendingAck,null);pendingAck=p;}};
context.nextMissing=i=>[0,1,2].find(j=>context.state.results[context.key(i,j)]===undefined);
vm.createContext(context);
function block(start,end){const a=html.indexOf(start),b=html.indexOf(end,a);assert(a>=0&&b>a,start);return html.slice(a,b);}
for(const name of ['m1State','m2State','m3State','m6State','newMissionState']){const line=html.split('\n').find(x=>x.startsWith(`function ${name}(`));vm.runInContext(line,context);}
for(const [start,end] of [['function m1Action(','root.addEventListener'],['function m2Action(','root.addEventListener'],['function m6Action(','root.addEventListener'],['function m3Action(','/* Integrated mission engine'],['function newMissionAction(','root.addEventListener']])vm.runInContext(block(start,end),context);
const s=context.state;
function act(i,a,v='') {s.ticket=i;const kind=i===0?'m1':i===1?'m2':i===2?'m3':i===5?'m6':'new';const fn=kind==='new'?context.newMissionAction:context[kind+'Action'];const beforeResults=JSON.stringify(s.results);const beforeStage=(i===0?s.m1:i===1?s.m2:i===2?s.m3:i===5?s.m6:s.mNew?.[i])?.stage;fn({dataset:{[kind]:a,value:v,val:v}});if(pendingAck){assert.equal(JSON.stringify(s.results),beforeResults,'A correct answer must wait for acknowledgment before earning a result');assert.equal((i===0?s.m1:i===1?s.m2:i===2?s.m3:i===5?s.m6:s.mNew?.[i])?.stage,beforeStage,'No automatic task jump');const acknowledgment=pendingAck;pendingAck=null;acknowledgment.onNext();}}
function closed(i){assert([0,1,2].every(j=>s.results[context.key(i,j)]===true),`Mission ${i+1} requires all three outcomes`);}
act(0,'add-copy');assert.equal(Object.keys(s.results).length,0,'Cannot submit before editing');
act(0,'begin');act(0,'diagnose','network');assert.equal(s.m1.stage,'diagnose');assert(node('m1-feedback').textContent);
act(0,'diagnose','viewer');act(0,'make-copy');act(0,'open-edit');node('m1-note').value='Не повідомляй свій пароль незнайомцям.';act(0,'save-copy');act(0,'deliver-logic','add');act(0,'add-copy');closed(0);
act(1,'begin');act(1,'diagnose','yes');act(1,'send-first');assert.equal(s.m2.stage,'printer','Printing requires a selected shared printer');act(1,'select','shared');act(1,'send-first');act(1,'new-message');act(1,'test-offline');act(1,'try-offline');act(1,'diagnose-offline');act(1,'fix','ask');act(1,'send-again');closed(1);
act(2,'begin');for(const flag of ['unknown','prize','private','hurry'])act(2,'flag',flag);act(2,'confirm-flags');act(2,'advice','safe');act(2,'follow');for(const v of ['stop','adult','block'])act(2,'safe-action',v);act(2,'confirm-actions');act(2,'finish');closed(2);
act(3,'begin');act(3,'diagnose','verify');act(3,'source','open');assert.equal(s.mNew[3].stage,'action','Source investigation cannot be skipped');act(3,'inspect-source');act(3,'source-check','author');act(3,'source-check','terms');act(3,'source','open');act(3,'next');for(const v of ['Марія Д.','Фотобібліотека «Світ природи»'])act(3,'pick',v);act(3,'confirm');closed(3);
act(4,'begin');act(4,'diagnose','broad');node('v4-search-input').value='Рукавичка текст української народної казки';act(4,'search');act(4,'next');act(4,'site','safe');closed(4);
act(5,'begin');act(5,'answer','tab');act(5,'tab-article');act(5,'bridge');act(5,'second');act(5,'follow');act(5,'go-back-stage');act(5,'back');act(5,'finish');closed(5);
act(6,'begin');act(6,'diagnose','host');act(6,'power');act(6,'check-folder');act(6,'next');act(6,'edit-local');act(6,'upload');assert.equal(s.mNew[6].stage,'follow','Upload requires inspected permission');act(6,'inspect-access');s.mNew[6].uploadPermission=true;act(6,'upload');closed(6);
act(7,'begin');for(const v of ['unknown','gift','disable'])act(7,'flag',v);act(7,'confirm-flags');act(7,'inspect-mail');act(7,'advice','safe');act(7,'next');for(const v of ['stop','adult','scan'])act(7,'pick',v);act(7,'confirm');closed(7);
assert.equal(Object.keys(s.results).length,24);assert(Object.values(s.results).every(Boolean));
console.log('PASS: all 8 network missions, 24 learning outcomes, rejected incorrect actions, investigation and permission prerequisites.');
const values=new Map(),location={hash:'#topics'},state={m1:{stage:'intro'},m2:{stage:'intro'},m3:{stage:'intro'},m6:{stage:'intro'}};
const a={window:{},state,DATA:Array(8).fill({}),levelsNames:Array.from({length:8},(_,i)=>'Місія '+i),localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},location,completed:()=>0,missionStatus:()=>({done:0,closed:false}),history:{pushState(_a,_b,h){location.hash=h;}}};
vm.createContext(a);vm.runInContext(fs.readFileSync('5/messages.js','utf8'),a);vm.runInContext(fs.readFileSync('5/academy.js','utf8'),a);const api=a.window.CyfroAcademy;
const lessonRoutes=['digital-class','objects','messages','web-search','media-detective','download-rescue'];
assert.deepEqual(JSON.parse(JSON.stringify(api.curriculum.flatMap(topic=>topic.routes))),lessonRoutes,'The numbered curriculum contains only lesson adventures');
assert.deepEqual(JSON.parse(JSON.stringify(api.catalog().map(lesson=>lesson.number))),['1','2','3','12','12а','13'],'Source lesson numbers retain gaps for future lessons');
assert.equal(new Set(api.cityOrder()).size,8,'The independent methodological adventure retains all eight missions');
assert(api.cityGroups().every(topic=>!topic.number&&topic.routes.every(route=>route.startsWith('city/'))),'Additional missions have no lesson number');
assert.deepEqual(JSON.parse(JSON.stringify(api.orderEntries([{route:'city/1'},{route:'download-rescue'},{route:'objects'}]).map(x=>x.route))),['objects','download-rescue','city/1'],'Additional missions follow the separate lesson list in progress reports');
api.catalog().forEach(lesson=>values.set(lesson.storageKey,JSON.stringify({stage:3,finished:true})));
assert(api.recommend().done,'Finishing lesson adventures does not make the additional city adventure compulsory');
values.clear();
console.log('PASS: source lesson numbers, reserved gaps, separate unnumbered eight-mission adventure and report ordering.');
assert.equal(api.recommend().hash,'digital-class');
values.set('cyfropomich5_lesson03_v1',JSON.stringify({stage:0,answers:['vision','','','','']}));assert(api.lessonStatus('messages').started,'Part of the first step is in progress');assert.equal(api.recommend().hash,'messages');
api.remember('city/6');assert.equal(api.recommend().hash,'city/6','Continue returns to last unfinished mission');
values.set('cyfropomich5_lesson01_v1',JSON.stringify({portal:2,stage:0,finished:true,started:true,safe:['','',''],kind:['','','',''],material:'',color:'',followup:false,moved:false,observed:'',errors:0,hints:0}));assert(api.lessonStatus('digital-class').finished,'Practice does not erase prior completion');assert.equal(api.totalDone(),1);
api.syncRoute('lesson','messages');assert.equal(location.hash,'#messages');api.syncRoute('academy');assert.equal(location.hash,'#topics');
api.reset();assert.equal(api.totalDone(),0);assert.equal(api.recommend().hash,'digital-class');
console.log('PASS: partial first-step status, last unfinished activity, preserved completion during practice, canonical routes and full reset.');
const backupCode=block('function validateMissionBackup(','async function restoreProgress(');vm.runInContext(backupCode,context);assert(context.validateMissionBackup(s));assert.throws(()=>context.validateMissionBackup({m1:{stage:'invalid'}}));assert.throws(()=>context.validateMissionBackup({m3:{stage:'flags',flags:'not-an-array'}}));
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify({format:'cyfropomich-progress',version:1,createdAt:'2026-11-16T12:00:00.000Z',player:'Тестування',results:s.results,labs:{},m1:s.m1,m2:s.m2,m3:s.m3,m6:s.m6,mNew:s.mNew,finale:{stage:0,mistakes:0,done:false},finishedAt:'2026-11-16T12:00:00.000Z'}));
console.log('PASS: valid legacy mission states accepted; corrupt stages and answer types rejected before import.');

assert(!html.includes('data-go=\"teacher\"'));assert(!html.includes('function teacher(){'));a.window.CyfroVisual={character(){}};a.root={addEventListener(){}};a.document={addEventListener(){}};a.addEventListener=()=>{};a.history.replaceState=(_a,_b,h)=>location.hash=h;location.hash='#teacher';api.init();assert.equal(location.hash,'#topics');assert.equal(state.screen,'academy');console.log('PASS: public teacher view removed, bookmarked teacher route returns to the map, and correct answers wait for explicit acknowledgment.');
// The optional finale also waits for acknowledgment, including its final completion.
context.root={addEventListener(_event,handler){context.finalHandler=handler;}};context.completed=()=>8;vm.runInContext(block('const FINAL_QUESTIONS=','window.CyfroAcademy.init();'),context);s.screen='finale';s.finale={stage:0,mistakes:0,done:false,feedback:''};
for(const [stage,choice] of [[0,1],[1,0],[2,1]]){context.finalHandler({target:{closest:()=>({dataset:{finalOption:String(choice)}})}});assert(pendingAck,'Finale needs a visible acknowledgment');assert.equal(s.finale.stage,stage);assert.equal(s.finale.done,false);const ack=pendingAck;pendingAck=null;ack.onNext();assert.equal(s.finale.stage,stage+1);}
assert.equal(s.finale.done,true);console.log('PASS: all 3 finale answers remain on their current question until Next, including final completion.');

