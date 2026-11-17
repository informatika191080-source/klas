/* Workshop mission: isolated state; no writes to existing mission keys. */
(function(){
'use strict';
window.CyfroWorkshopMount=function(){
const lifetime=new AbortController();
let highlightTimer=null;
window.CyfroLessonDispose=()=>{lifetime.abort();clearTimeout(highlightTimer);};
const $=id=>document.getElementById(id);
const key='cyfropomich5_lesson02_v1';
const guideScope=$('mission'),guideSlot=document.createElement('div'),feedbackSlot=document.createElement('div');guideSlot.className='workshop-guide';feedbackSlot.className='lesson-feedback-slot';$('workspace').querySelector('.brief').before(guideSlot);$('workspace').querySelector('.actions').before(feedbackSlot);window.CyfroGuide.bind(guideScope);
function clearFeedback(){feedbackSlot.replaceChildren();lastIssue='';}
function renderLearning(){guideSlot.innerHTML=state.stage<3?window.CyfroGuide.render(['fill','text','commands'][state.stage],guideSlot):'';}
const defaults=()=>({stage:0,color:'blue',width:120,title:'Майстерня',size:18,place:'middle',copy:false,right:false,triangle:true,errors:0,hints:0,actions:0});
const colors={blue:['Синій','#81adff'],mint:['М’ятний','#69efd3'],pink:['Рожевий','#ec9ccc']};
const names={ribbon:'Прямокутник',title:'Заголовок',star:'Зірка',copy:'Копія зірки',triangle:'Трикутник'};
let state=defaults(),selected=null,history=[],noticeTimer,storageOK=true,lastIssue='',hintLevel=0,failures=0,lastFailure='';
function requirements(s=state){return [
 [{ok:s.color==='mint',text:'Прямокутник: м’ятний колір заливки.'},{ok:s.width===240,text:'Ширина прямокутника — 240 умовних одиниць.'}],
 [{ok:s.title.trim()==='Цифрова майстерня',text:'Заголовок: «Цифрова майстерня».'},{ok:s.size===24,text:'Розмір символів заголовка — 24.'},{ok:s.place==='top',text:'Заголовок розміщено вгорі афіші.'}],
 [{ok:s.copy,text:'Створено одну копію зірки.'},{ok:s.copy&&s.right,text:'Копію зірки переміщено праворуч.'},{ok:!s.triangle,text:'Зайвий трикутник видалено.'}]
];}
try{
 const s=JSON.parse(localStorage.getItem(key)||'null');
 if(s&&typeof s==='object'){
  state.started=s.started===true;state.finished=s.finished===true||s.stage===3;
  for(const k of ['stage','width','size','errors','hints','actions'])if(Number.isInteger(s[k])&&s[k]>=0)state[k]=s[k];
  if(![0,1,2,3].includes(state.stage))state.stage=0;
  if(![120,160,200,240].includes(state.width))state.width=120;
  if(![18,24,30].includes(state.size))state.size=18;
  if(Object.hasOwn(colors,s.color))state.color=s.color;
  if(typeof s.title==='string')state.title=s.title.slice(0,24);
  if(['middle','top','bottom'].includes(s.place))state.place=s.place;
  for(const k of ['copy','right','triangle'])if(typeof s[k]==='boolean')state[k]=s[k];
  for(let i=0;i<state.stage;i++)if(!requirements()[i].every(r=>r.ok)){state.stage=i;break;}
 }
}catch(e){storageOK=false;}
function save(){
 state.finished=state.finished===true||state.stage===3;
 try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;}catch(e){storageOK=false;}
 $('save-state').textContent=storageOK?'Прогрес збережено в цьому браузері.':'Прогрес доступний лише до закриття сторінки: браузер не дозволяє збереження.';
}
function notice(text,error=false){
 if(typeof showGameNotice==='function'){showGameNotice({title:error?'Перевірмо разом':'Команда ЦифроПомочі',text,kind:error?'error':'info',duration:7500});return;}
 clearTimeout(noticeTimer);$('notice').querySelector('span').textContent=text;$('notice').dataset.error=String(error);$('notice').hidden=false;
 noticeTimer=setTimeout(()=>$('notice').hidden=true,6500);
}
$('close-notice')?.addEventListener('click',()=>{clearTimeout(noticeTimer);$('notice').hidden=true;});
function pose(mood='neutral'){
 const kinds=['pixel','bayt','kiber'];
 $('coach').dataset.mood=mood;
 if(window.CyfroWorkshopCharacter)$('coach').querySelector('.mission-avatar').innerHTML=window.CyfroWorkshopCharacter(kinds[Math.min(state.stage,2)],mood);
}
const scenes=[
 ['ПІКСЕЛЬ: налаштуй основу!','Досліджуй об’єкти — кожен має власні параметри.','Колір і розмір','Вибери прямокутник на афіші. У панелі керування зміни колір заливки та ширину за замовленням команди.'],
 ['БАЙТ: афіші потрібен заголовок!','Спочатку вибери об’єкт, потім змінюй його властивості.','Текст і положення','Вибери заголовок на афіші. Відредагуй його вміст, зміни розмір символів і розмісти вгорі.'],
 ['КІБЕР: залишилося впорядкувати!','Контекстні команди залежать від вибраного об’єкта.','Команди об’єкта','Вибери зірку й відкрий її команди. Створи копію, перемісти саме копію праворуч, а потім видали трикутник.']
];
function renderChecklist(){
 $('requirements').replaceChildren();
 if(state.stage>2)return;
 for(const r of requirements()[state.stage]){const li=document.createElement('li');li.classList.toggle('met',r.ok);li.textContent=r.text;$('requirements').append(li);}
}
function renderObjects(){
 $('obj-ribbon').style.backgroundColor=colors[state.color][1];$('obj-ribbon').style.width=(state.width/320*100)+'%';
 $('obj-title').textContent=state.title||'…';$('obj-title').style.setProperty('--font-size',state.size);
 $('obj-title').style.top={top:'23%',middle:'34%',bottom:'57%'}[state.place];
 $('obj-copy').hidden=!state.copy;$('obj-copy').style.left=state.right?'70%':'42%';$('obj-triangle').hidden=!state.triangle;
 document.querySelectorAll('[data-object]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.object===selected)));
}
function property(label,value){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;$('properties').append(dt,dd);}
function renderInspector(){
 $('selection-status').textContent=selected?'Вибрано: '+names[selected]:'Об’єкт не вибрано';
 $('properties-title').textContent=selected?names[selected]:'Вибери об’єкт на афіші';$('properties').replaceChildren();
 $('ribbon-tools').hidden=!(selected==='ribbon'&&state.stage===0);
 $('title-tools').hidden=!(selected==='title'&&state.stage===1);
 $('context-tools').hidden=!(selected&&state.stage===2);
 if(selected==='ribbon'){property('Колір заливки',colors[state.color][0]);property('Ширина',state.width+' ум. од.');property('Висота','50 ум. од.');}
 else if(selected==='title'){property('Вміст',state.title||'Порожньо');property('Розмір символів',String(state.size));property('Положення',{top:'Угорі',middle:'Посередині',bottom:'Унизу'}[state.place]);}
 else if(selected){property('Тип','Графічний об’єкт');property('Положення',selected==='copy'?(state.right?'Праворуч':'Посередині'):selected==='star'?'Ліворуч':'Праворуч');}
 $('width').value=state.width;$('width-value').value=state.width;
 if(document.activeElement!==$('title-input'))$('title-input').value=state.title;
 $('font-size').value=state.size;$('title-place').value=state.place;
 document.querySelectorAll('[data-color]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.color===state.color)));
 document.querySelector('[data-command="duplicate"]').disabled=!(selected==='star'&&!state.copy);
 document.querySelector('[data-command="right"]').disabled=!(selected==='copy'&&!state.right);
 document.querySelector('[data-command="delete"]').disabled=!(selected==='triangle'&&state.triangle);
 $('undo').disabled=history.length===0;
}
function closeContext(){const hadFocus=$('context-menu').contains(document.activeElement);$('context-menu').hidden=true;$('context-toggle').setAttribute('aria-expanded','false');if(hadFocus)$('context-toggle').focus();}
function selectObject(id){selected=id;clearFeedback();closeContext();renderObjects();renderInspector();}
function draw(){renderObjects();renderInspector();renderChecklist();}
function showStage(moveFocus=false){
 selected=null;history=[];hintLevel=0;clearFeedback();closeContext();renderLearning();
 if(window.CyfroMission)window.CyfroMission.title='Програмні об’єкти: '+(state.stage===3?'завершено':scenes[state.stage][2]);
 let progress=document.getElementById('workshop-progress-label');if(!progress){progress=document.createElement('p');progress.id='workshop-progress-label';progress.className='task-progress-label';$('workspace').before(progress);}progress.textContent=state.stage===3?'✓ Три частини виконано':(state.finished?'Повторення · ':'')+'Частина '+(state.stage+1)+' із 3';
 $('workspace').hidden=state.stage===3;$('finale').hidden=state.stage!==3;
 document.querySelectorAll('.route span').forEach((n,i)=>{n.classList.toggle('done',i<state.stage);if(i===state.stage)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current');});
 if(state.stage<3){const s=scenes[state.stage];$('coach-name').textContent=s[0];$('coach-line').textContent=s[1];$('task-title').textContent=s[2];$('task-text').textContent=s[3];pose();draw();}
 else{
  renderObjects();const poster=$('canvas').cloneNode(true);poster.removeAttribute('id');poster.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));poster.querySelectorAll('button').forEach(n=>{n.disabled=true;n.removeAttribute('aria-pressed');});
  $('final-poster').replaceChildren(poster);
  $('result-summary').textContent='Виконано частин: 3 із 3. Повторних перевірок: '+state.errors+'. Підказок БІПа: '+state.hints+'.';
  $('completion-storage').textContent=storageOK?'Результат збережено в цьому браузері.': 'Браузер не дозволяє зберегти результат після закриття сторінки.';
  document.querySelectorAll('.hero-team [data-figure]').forEach(n=>{if(window.CyfroWorkshopCharacter)n.innerHTML=window.CyfroWorkshopCharacter(n.dataset.figure,'celebrate');});
 }
 if(moveFocus)window.CyfroUX.step(state.stage===3?$('finale'):$('workspace'));
 document.dispatchEvent(new CustomEvent('cyfro-mission-stage',{detail:{step:state.stage}}));
}
function mutate(patch){
 state.started=true;clearFeedback();
 failures=0;lastFailure='';
 history.push({...state});if(history.length>60)history.shift();Object.assign(state,patch);state.actions++;lastIssue='';save();draw();
}
$('canvas').addEventListener('click',e=>{const n=e.target.closest('[data-object]');if(n)selectObject(n.dataset.object);});
function openContext(){
 if(state.stage!==2||!selected)return;
 $('context-menu').hidden=false;$('context-toggle').setAttribute('aria-expanded','true');
 $('context-menu').querySelector('button:not(:disabled)')?.focus();
}
$('canvas').addEventListener('contextmenu',e=>{const n=e.target.closest('[data-object]');if(n&&state.stage===2){e.preventDefault();selectObject(n.dataset.object);openContext();}});
$('canvas').addEventListener('keydown',e=>{
 if((e.shiftKey&&e.key==='F10')||e.key==='ContextMenu'){
  const n=e.target.closest('[data-object]');if(n&&state.stage===2){e.preventDefault();selectObject(n.dataset.object);openContext();}
 }
});
$('context-toggle').addEventListener('click',()=>$('context-menu').hidden?openContext():closeContext());
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeContext();},{signal:lifetime.signal});
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{if(state.stage===0&&selected==='ribbon')mutate({color:b.dataset.color});}));
$('width').addEventListener('input',()=>{if(state.stage===0&&selected==='ribbon')mutate({width:Number($('width').value)});});
$('title-input').addEventListener('input',()=>{if(state.stage===1&&selected==='title')mutate({title:$('title-input').value.slice(0,24)});});
$('font-size').addEventListener('change',()=>{if(state.stage===1&&selected==='title')mutate({size:Number($('font-size').value)});});
$('title-place').addEventListener('change',()=>{if(state.stage===1&&selected==='title')mutate({place:$('title-place').value});});
$('context-menu').addEventListener('click',e=>{
 const b=e.target.closest('[data-command]');if(!b||b.disabled||state.stage!==2)return;
 const command=b.dataset.command;
 if(command==='duplicate'&&selected==='star'&&!state.copy){mutate({copy:true});selectObject('copy');notice('Копію створено. Тепер це окремий об’єкт: вибери для неї потрібну команду.');}
 else if(command==='right'&&selected==='copy'){mutate({right:true});closeContext();notice('Копію переміщено. Змінилося її положення; колір і розмір залишилися сталими.');}
 else if(command==='delete'&&selected==='triangle'){mutate({triangle:false});selected=null;closeContext();draw();$('check').focus();notice('Трикутник видалено з афіші. Помилкову дію можна скасувати.');}
});
$('undo').addEventListener('click',()=>{
 const old=history.pop();if(!old)return;
 // Attempts and help counts describe the whole session and are never undone.
 const stats={errors:state.errors,hints:state.hints,actions:state.actions};state={...old,...stats};
 if((selected==='copy'&&!state.copy)||(selected==='triangle'&&!state.triangle))selected=null;
 closeContext();clearFeedback();save();draw();notice('Останню зміну скасовано.');
});
$('check').addEventListener('click',()=>{
 if(state.stage>2)return;
 const missing=requirements()[state.stage].filter(r=>!r.ok);
 if(missing.length){const failureKey=state.stage+':'+missing[0].text;failures=failureKey===lastFailure?failures+1:1;lastFailure=failureKey;state.errors++;lastIssue=window.CyfroGuide.workshopProblem(state,selected)||missing[0].text;save();pose('think');feedbackSlot.innerHTML=window.CyfroGuide.feedback(lastIssue);feedbackSlot.scrollIntoView({block:'nearest',behavior:'instant'});
 document.dispatchEvent(new CustomEvent('cyfro-mission-result',{detail:{ok:false,step:state.stage,card:0}}));
 if(failures===2)document.dispatchEvent(new CustomEvent('cyfro-assist-offer'));return;}
 const messages=['Основу налаштовано! Змінилися колір і ширина, а висота залишилася сталою.','Заголовок готовий! Ти змінив вміст, розмір символів і положення об’єкта.','Замовлення виконано! Афіша готова.'];
 const message=messages[state.stage];window.CyfroUX.pass({role:['pixel','bayt','kiber'][state.stage],text:message,title:state.stage===2?'Афішу створено!':'Правильно!',nextLabel:state.stage===2?'Переглянути афішу →':'Далі →',onNext:()=>{state.stage++;save();showStage(true);document.dispatchEvent(new CustomEvent('cyfro-mission-result',{detail:{ok:true,step:state.stage,completed:state.stage===3}}));}});
});
$('help').addEventListener('click',()=>document.dispatchEvent(new CustomEvent('cyfro-assist-open')));
window.CyfroMission={title:"Програмні об’єкти: "+scenes[Math.min(state.stage,2)][2],help(type){
 if(state.stage===3)return 'Афіша готова! Можеш повернутися до місій або пройти цю пригоду ще раз.';
 if(type==='risk')return ['Змінюй властивості вибраного об’єкта. Колір і розмір — різні параметри; зміна одного не повинна непомітно змінювати інший.','Зміна вмісту заголовка — редагування; зміна його вигляду — форматування. Спочатку перевір, який об’єкт вибрано.','Видалення прибирає вибраний об’єкт. Якщо помилився, скористайся «Скасувати дію». Оригінал зірки має залишитися.'][state.stage];
 if(type==='whatif')return 'Досліди наслідки двох дій. Це пояснення: воно не змінить твою афішу.';
 if(type==='help')return [
  'На афіші є програмні об’єкти: прямокутник, заголовок, зірка й трикутник. Натисни прямокутник: праворуч відкриються його властивості. На телефоні панель розташована під афішею.',
  'Вміст і оформлення заголовка — різні властивості. Натисни сам заголовок на афіші, а потім скористайся полем введення та списками в панелі керування.',
  'Команди виконуються над вибраним об’єктом. Натисни об’єкт і кнопку «Команди об’єкта». На комп’ютері можна також натиснути праву кнопку миші на об’єкті.'
 ][state.stage];
 if(type==='next'){
  if(lastIssue)return lastIssue;
  if(state.stage===0){
   if(selected!=='ribbon')return 'Натисни прямокутник на світлій афіші. Відкриється панель його властивостей. На телефоні вона під афішею.';
   if(state.color!=='mint')return 'У панелі прямокутника знайди «Колір заливки». Порівняй кольорові кнопки із замовленням команди.';
   if(state.width!==240)return 'Зміни ширину повзунком у панелі прямокутника. Поточне число показано над ним; потрібне значення є в замовленні.';
   return 'Обидві вимоги виконано. Натисни «Перевірити результат» під замовленням.';
  }
  if(state.stage===1){
   if(selected!=='title')return 'Натисни слово заголовка на афіші. Панель має показати «Заголовок».';
   if(state.title.trim()!=='Цифрова майстерня')return 'У полі «Вміст заголовка» введи назву із замовлення. Поле змінює текст; решта інструментів — його вигляд.';
   if(state.size!==24)return 'Відкрий список «Розмір символів» і звір значення із замовленням.';
   if(state.place!=='top')return 'Відкрий список «Положення заголовка». Обери розміщення, зазначене в замовленні.';
   return 'Три вимоги виконано. Перевір результат кнопкою під замовленням.';
  }
  if(!state.copy)return selected==='star'?'Відкрий «Команди об’єкта». Знайди дію, що створює ще одну таку саму зірку.':'Вибери зірку ліворуч на афіші. Далі відкрий її команди.';
  if(!state.right)return selected==='copy'?'Відкрий команди копії й знайди дію зміни її положення.':'Вибери копію зірки посередині. Оригінал ліворуч не переміщуй.';
  if(state.triangle)return selected==='triangle'?'Відкрий команди трикутника. Знайди дію, що прибирає зайвий об’єкт.':'Вибери трикутник на афіші. Він зайвий у цьому замовленні.';
  return 'Команди виконано. Натисни «Перевірити результат», щоб завершити звернення.';
 }
 hintLevel++;state.hints++;save();
 const stepHints=[
  ['Спочатку вибери прямокутник. Заливка — це колір його внутрішньої області.','Кольорові кнопки змінюють заливку, повзунок — ширину. Значення ширини видно над повзунком.'],
  ['Щоб змінити текст, працюй із полем «Вміст заголовка». Щоб змінити його вигляд — зі списками нижче.','Порівняй три властивості заголовка з трьома вимогами замовлення: вміст, розмір символів, положення.'],
  [state.copy?'Копія — самостійний об’єкт. Її можна вибрати й перемістити окремо від оригіналу.':'Створення копії додає ще один об’єкт, а переміщення змінює положення наявного.',state.copy&&state.right?'Перевір, чи залишився на афіші трикутник. Команди залежать від того, який об’єкт вибрано.':'Перевір напис «Вибрано» над афішею. Команда має стосуватися саме того об’єкта, який потрібно змінити.']
 ];return 'Підказка '+Math.min(hintLevel,3)+' із 3. '+(hintLevel>=3?window.CyfroMission.help('next'):stepHints[state.stage][Math.min(hintLevel-1,1)])+(lastIssue?' Зараз перевір: '+lastIssue:'');
},branches(){if(state.stage===3)return [];if(state.stage===1)return [['Змінити текст заголовка','Зміниться його вміст. Це редагування текстового об’єкта.'],['Змінити розмір символів','Зміниться вигляд заголовка. Його текст залишиться тим самим.']];return state.stage===2?[['Перемістити оригінал замість копії','Оригінал змінить положення, а копія залишиться посередині. Умова про переміщення копії не буде виконана.'],['Видалити зайвий трикутник','З афіші зникне трикутник. Інші об’єкти залишаться; помилкове видалення можна скасувати.']]:[['Змінити колір вибраного об’єкта','Зміниться його колір. Ширина, положення та інші об’єкти залишаться без змін.'],['Змінювати параметри без вибору потрібного об’єкта','Можна змінити не той об’єкт. Перевіряй напис «Вибрано» перед дією.']];},locate(){
 let id=state.stage===3?'final-title':'check';
 if(state.stage===0)id=selected!=='ribbon'?'obj-ribbon':state.color!=='mint'?'ribbon-tools':state.width!==240?'width':'check';
 if(state.stage===1)id=selected!=='title'?'obj-title':state.title.trim()!=='Цифрова майстерня'?'title-input':state.size!==24?'font-size':state.place!=='top'?'title-place':'check';
 if(state.stage===2)id=!state.copy?(selected==='star'?'context-toggle':'obj-star'):!state.right?(selected==='copy'?'context-toggle':'obj-copy'):state.triangle?(selected==='triangle'?'context-toggle':'obj-triangle'):'check';
 const n=$(id);if(!n)return;n.scrollIntoView({block:'center',behavior:'instant'});n.classList.add('academy-highlight');n.focus?.({preventScroll:true});clearTimeout(highlightTimer);highlightTimer=setTimeout(()=>n.classList.remove('academy-highlight'),4500);
}};
$('replay').addEventListener('click',()=>{state={...defaults(),finished:state.finished,started:true};selected=null;history=[];save();showStage(true);notice('Нове замовлення! Усі об’єкти повернуто до початкового стану.');});
document.querySelectorAll('.hero-team [data-figure]').forEach(n=>{if(window.CyfroWorkshopCharacter)n.innerHTML=window.CyfroWorkshopCharacter(n.dataset.figure,'joy');});
save();showStage();
};
})();

