/* Lesson registry mounted inside the existing portal runtime. */
(function(){
"use strict";
const workshopTemplate="\n<section class=\"step\" id=\"workspace\" aria-labelledby=\"task-title\">\n<div class=\"mission-scene\" id=\"coach\"><div class=\"mission-avatar\" aria-hidden=\"true\"></div><div><b id=\"coach-name\"></b><small id=\"coach-line\"></small></div></div>\n<div class=\"task-heading\"><div><h2 id=\"task-title\"></h2><p id=\"task-text\"></p></div><button type=\"button\" class=\"secondary\" id=\"help\">🤖 Допомога БІПа</button></div>\n<div class=\"workbench\">\n<div class=\"editor\"><div class=\"editor-bar\"><span><span class=\"live-dot\"></span> Студія афіш</span><span id=\"selection-status\" role=\"status\">Об’єкт не вибрано</span></div>\n<div class=\"canvas\" id=\"canvas\" aria-label=\"Інтерактивна афіша. Вибери об’єкт натисканням.\">\n<div class=\"paper-heading\">ВІДКРИВАЄМО МОЖЛИВОСТІ</div>\n<button type=\"button\" class=\"art-object ribbon\" id=\"obj-ribbon\" data-object=\"ribbon\" aria-label=\"Прямокутник\" aria-pressed=\"false\"></button>\n<button type=\"button\" class=\"art-object title-object\" id=\"obj-title\" data-object=\"title\" aria-label=\"Заголовок\" aria-pressed=\"false\">Майстерня</button>\n<button type=\"button\" class=\"art-object star-object\" id=\"obj-star\" data-object=\"star\" aria-label=\"Зірка\" aria-pressed=\"false\">★</button>\n<button type=\"button\" class=\"art-object star-object\" id=\"obj-copy\" data-object=\"copy\" aria-label=\"Копія зірки\" aria-pressed=\"false\" hidden>★</button>\n<button type=\"button\" class=\"art-object triangle-object\" id=\"obj-triangle\" data-object=\"triangle\" aria-label=\"Трикутник\" aria-pressed=\"false\">▲</button>\n<div class=\"paper-caption\">ДОСЛІДЖУЙ · СТВОРЮЙ · ДІЛИСЯ</div>\n</div><div class=\"editor-foot\"><span>Натисни об’єкт, щоб працювати з ним.</span><button type=\"button\" id=\"undo\" disabled>↶ Скасувати дію</button></div></div>\n<aside class=\"inspector\" aria-labelledby=\"properties-title\"><div class=\"inspector-head\"><div class=\"eyebrow\">Панель керування</div><h3 id=\"properties-title\">Вибери об’єкт на афіші</h3></div>\n<p class=\"concept\">Програмний об’єкт використовують у програмі. Він має властивості та дії. Властивості також називають параметрами.</p>\n<dl id=\"properties\"></dl>\n<fieldset id=\"ribbon-tools\" hidden><legend>Змінити прямокутник</legend><div class=\"field-label\">Колір заливки</div><div class=\"swatches\"><button type=\"button\" data-color=\"blue\" aria-label=\"Синій\" title=\"Синій\" style=\"--swatch:#81adff\"></button><button type=\"button\" data-color=\"mint\" aria-label=\"М’ятний\" title=\"М’ятний\" style=\"--swatch:#69efd3\"></button><button type=\"button\" data-color=\"pink\" aria-label=\"Рожевий\" title=\"Рожевий\" style=\"--swatch:#ec9ccc\"></button></div><label for=\"width\">Ширина: <output id=\"width-value\" for=\"width\">120</output> умовних одиниць</label><input id=\"width\" type=\"range\" min=\"120\" max=\"240\" step=\"40\" value=\"120\"><p class=\"micro\">Повзунок змінює ширину; висота залишається сталою.</p></fieldset>\n<fieldset id=\"title-tools\" hidden><legend>Змінити заголовок</legend><label for=\"title-input\">Вміст заголовка</label><input id=\"title-input\" maxlength=\"24\" value=\"Майстерня\" autocomplete=\"off\"><label for=\"font-size\">Розмір символів</label><select id=\"font-size\"><option value=\"18\">18</option><option value=\"24\">24</option><option value=\"30\">30</option></select><label for=\"title-place\">Положення заголовка</label><select id=\"title-place\"><option value=\"middle\">Посередині</option><option value=\"top\">Угорі</option><option value=\"bottom\">Унизу</option></select></fieldset>\n<div id=\"context-tools\" hidden><button type=\"button\" id=\"context-toggle\" aria-expanded=\"false\" aria-controls=\"context-menu\">⋮ Команди об’єкта</button><p class=\"micro\">Також: права кнопка миші на об’єкті або Shift + F10.</p><div id=\"context-menu\" class=\"context-menu\" aria-label=\"Команди вибраного об’єкта\" hidden><button type=\"button\" data-command=\"duplicate\">Створити копію</button><button type=\"button\" data-command=\"right\">Перемістити праворуч</button><button type=\"button\" data-command=\"delete\">Видалити</button></div></div>\n</aside></div>\n<div class=\"brief\"><h3>Замовлення команди</h3><ul id=\"requirements\"></ul></div>\n<div class=\"actions\"><button type=\"button\" class=\"button\" id=\"check\">Перевірити результат →</button><span id=\"save-state\" class=\"micro\" role=\"status\"></span></div>\n</section>\n<section class=\"step finale\" id=\"finale\" hidden aria-labelledby=\"final-title\"><div class=\"eyebrow\">Замовлення виконано</div><div class=\"trophy\" aria-hidden=\"true\">🏆</div><h2 id=\"final-title\">Афішу відновлено!</h2><p>Ти керуєш програмними об’єктами: змінюєш їхні властивості та виконуєш команди.</p><div id=\"final-poster\" class=\"final-poster\"></div><ul class=\"skills\"><li>Змінено колір заливки та ширину прямокутника.</li><li>Відредаговано текст, розмір символів і положення заголовка.</li><li>Створено та переміщено копію зірки, видалено зайвий об’єкт.</li></ul><p id=\"result-summary\"></p><p class=\"micro\" id=\"completion-storage\"></p><div class=\"actions\"><a href=\"#topics\" data-academy-link=\"topics\" class=\"button\">До місій 5 класу</a><button type=\"button\" class=\"secondary\" id=\"replay\">Пройти ще раз</button></div></section>\n";

const ids=['digital-class','objects','messages'];
const titles={'digital-class':'Безпечна робота. Об’єкти та їхні властивості',objects:'Програмні об’єкти та дії над ними',messages:'Повідомлення. Органи чуття. Інформація'};
const keys={'digital-class':'cyfropomich5_lesson01_v1',objects:'cyfropomich5_lesson02_v1',messages:'cyfropomich5_lesson03_v1'};
const read=id=>{try{const s=JSON.parse(localStorage.getItem(keys[id])||'null');return s&&typeof s==='object'?s:{};}catch(e){return {};}};
let routeLock=false,lastRouteHash=location.hash;
function lessonStatus(id){const s=read(id);return {stage:Math.max(0,Math.min(3,Number(s.stage)||0)),errors:Math.max(0,Number(s.errors)||0),hints:Math.max(0,Number(s.hints)||0)};}
function side(id){return '<aside class="panel aside academy-aside"><div class="caps">Твоя навчальна пригода</div><h3>Мапа тем</h3><div class="academy-side">'+ids.map(x=>'<button class="navbtn '+(x===id?'active':'')+'" data-lesson="'+x+'">'+safe(titles[x])+'</button>').join('')+'<button class="navbtn" data-go="home">Мережі та інтернет</button></div><p class="tiny">БАЙТ веде за завданням, ПІКСЕЛЬ дає підказки, КІБЕР пояснює наслідки. БІП збирає допомогу в одному вікні.</p><button class="btn secondary small" data-go="academy">← Усі теми</button></aside>';}
function home(){
 const done=ids.filter(x=>lessonStatus(x).stage===3).length+completed();
 return `<main><section class="hero campaign-hero"><div class="hero-text"><div class="hero-eyebrow"><span class="signal-dot"></span> ТВОЯ ЦИФРОВА ПРИГОДА · 5 КЛАС</div><h1>Досліджуй. Створюй.<br><span class="gradient">Допомагай героям.</span></h1><p class="campaign-lead">Обери тему, прочитай звернення та виконай завдання у віртуальному середовищі. Команда завжди на зв’язку.</p><div class="campaign-buttons"><button class="btn" data-lesson="digital-class">До цифрового класу →</button><button class="btn secondary" data-go="home">🏙️ Цифрове місто</button></div><div class="campaign-welcome"><span class="welcome-medal">✦</span><span><strong>Твій поступ: ${done} із ${ids.length+8} місій</strong><small>Навчайся у власному темпі. Помилки можна виправляти.</small></span></div></div><div class="campaign-art" aria-hidden="true"><div class="campaign-orbit orbit-outer"></div><div class="campaign-orbit orbit-inner"></div><div class="campaign-grid"></div><div class="campaign-bot"><span class="bot-antenna"></span><span class="bot-head"><i class="bot-eye"></i><i class="bot-eye"></i><i class="bot-mouth"></i></span><span class="bot-body">БІП</span></div><div class="orbit-chip chip-one">📬 Життєві ситуації</div><div class="orbit-chip chip-two">🧩 Практичні дії</div><div class="orbit-chip chip-three">✨ Твоя команда</div></div></section>${teamMarkup(false)}<section class="missions-section"><div class="section-intro"><div><span class="caps">Мапа навчальних пригод</span><h2>Обери тему</h2></div></div><div class="academy-cards">${ids.map((id,i)=>{const s=lessonStatus(id);return `<button class="mission-card" data-lesson="${id}"><div class="order"><span>ЦИФРОВА ПРИГОДА</span><span>${s.stage===3?'✓ ЗАВЕРШЕНО':s.stage?'ПРОДОВЖИТИ':'РОЗПОЧАТИ'}</span></div><div class="face">${portrait(id==='digital-class'?1:id==='objects'?0:2)}</div><strong>${safe(titles[id])}</strong><p class="tiny">${id==='digital-class'?'Підготуй робочі місця, упорядкуй об’єкти та досліди їхні властивості.':id==='objects'?'Віднови афішу: обирай об’єкти, змінюй параметри, досліджуй команди.':'Досліди сигнали, допоможи зрозуміти повідомлення й створи презентацію про органи чуття.'}</p><span class="status">${s.stage} / 3 частини</span></button>`;}).join('')}<button class="mission-card" data-go="home"><div class="order"><span>СЛУЖБА ПІДТРИМКИ</span><span>8 ЗВЕРНЕНЬ</span></div><div class="face">${portrait(5)}</div><strong>Мережі та інтернет</strong><p class="tiny">Спільні файли, мережевий друк, пошук, браузер і безпечне спілкування.</p><span class="status">${completed()} / 8 місій · лабораторія та диплом</span></button></div></section></main>`;
}
function view(id){
 if(!ids.includes(id))id='digital-class';
 const story=id==='messages'?'Софійка: «Ми відкриваємо парк повідомлень. Допоможи розібрати сигнали, зробити оголошення зрозумілими та підготувати два слайди про сприйняття повідомлень».':id==='objects'?'Оля: «Ми готуємо відкриття цифрової майстерні. У макеті афіші переплутали оформлення. Допоможи відновити його та поясни, які властивості змінилися».':'Максим: «До цифрового класу завезли нові об’єкти. Допоможи підготувати безпечні місця, розібрати картки й заповнити каталог». ';
 return '<div class="game-layout">'+side(id)+'<main class="panel stage academy-mission" id="mission" tabindex="-1"><div class="stage-top"><span class="tag">ЦифроПоміч · 5 клас</span><button class="navbtn" data-go="academy">← Мапа тем</button></div><div class="ticket-header"><div class="portrait-frame">'+portrait(id==='objects'?0:id==='messages'?2:1)+'</div><div><span class="caps">Звернення до служби підтримки</span><h1 class="academy-title">'+safe(titles[id])+'</h1></div></div><div class="chat"><div class="sender">Нове звернення</div><p>'+safe(story)+'</p></div>'+teamMarkup(true)+(id==='messages'?'<div id="messages-mission" class="msg-mission"></div>':id==='objects'?'<nav class="route" aria-label="Поступ місії"><span>Заливка й розмір</span><span>Текст і положення</span><span>Команди об’єкта</span></nav>'+workshopTemplate:'<div id="digital-class"></div>')+'</main></div>';
}
function mount(id){if(id==='messages')window.CyfroMessages.mount();else if(id==='objects')window.CyfroWorkshopMount();else window.CyfroDigitalClass.mount();}
function navigate(id){if(!ids.includes(id))return;closeGameNotice();state.screen='lesson';state.portalLesson=id;syncRoute('lesson',id);render();}
function syncRoute(screen,id){
 if(routeLock)return;
 const h=screen==='academy'?'topics':screen==='lesson'?(id||state.portalLesson):screen==='home'?'city':screen==='game'?'city/'+(state.ticket+1):screen;
 if(location.hash!=='#'+h)history.pushState(null,'','#'+h);lastRouteHash=location.hash;
}
function route(){
 if(lastRouteHash===location.hash)return;lastRouteHash=location.hash;
 const h=location.hash.slice(1);routeLock=true;
 try{
  if(ids.includes(h)){state.screen='lesson';state.portalLesson=h;}
  else if(h==='topics')state.screen='academy';
  else if(/^city\/[1-8]$/.test(h)){start(Number(h.split('/')[1])-1);return;}
  else if(h==='city'||!h)state.screen='home';
  else if(['labs','report','teacher','guide'].includes(h))state.screen=h;
  else if(h==='finale')state.screen=completed()===8?'finale':'home';
  else state.screen='academy';
  render();
 }finally{routeLock=false;}
}
function results(){return '<section class="panel academy-results"><div class="caps">Навчальні теми</div><h2>Твої практичні місії</h2>'+ids.map(id=>{const x=lessonStatus(id);return '<div class="academy-result"><strong>'+safe(titles[id])+'</strong><span>'+x.stage+' / 3 частини · повторні перевірки: '+x.errors+' · підказки: '+x.hints+'</span></div>';}).join('')+'</section>';}
function init(){
 window.CyfroWorkshopCharacter=window.CyfroVisual.character;
 root.addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)navigate(b.dataset.lesson);const link=e.target.closest('[data-academy-link]');if(link){e.preventDefault();go('academy');}});
 document.addEventListener('cyfro-assist-open',()=>{if(!window.CyfroMission)return;bipPanelOpen=true;bipReply=window.CyfroMission.help('next');bipWhatIf=false;updateBip();});
 document.addEventListener('cyfro-mission-stage',()=>{if(!window.CyfroMission)return;bipReply='';bipWhatIf=false;updateBip();});
 document.addEventListener('cyfro-assist-offer',()=>{if(!window.CyfroMission)return;showGameNotice({title:'БІП поруч',text:'Бачу, що цей крок складний. Відкрий мене: поясню наступну дію або покажу інструмент.',duration:6000});});
 addEventListener('popstate',route);addEventListener('hashchange',route);
 const h=location.hash.slice(1);if(ids.includes(h)){state.screen='lesson';state.portalLesson=h;}else if(h==='topics')state.screen='academy';else if(/^city\/[1-8]$/.test(h)){state.screen='game';state.ticket=Number(h.split('/')[1])-1;state.step=nextMissing(state.ticket)??3;}else if(['labs','report','teacher','guide'].includes(h))state.screen=h;
}

function cityContext(){
 const i=state.ticket,m=i===0?state.m1:i===1?state.m2:i===2?state.m3:i===5?state.m6:(state.mNew||{})[i]||{};
 const stage=m?.stage||'intro';
 const paths=[
 {intro:'Прочитай звернення Олі та натисни «Прийняти заявку».',diagnose:'Досліди права доступу до початкового документа. Обери пояснення, яке узгоджується з відомостями.',viewer:'У віртуальному диску досліди дозволені дії над документом. Потрібна власна робоча копія.',copy:'Власну копію вже створено. Відкрий її для редагування.',edit:'Введи власне правило безпеки в текстове поле копії та збережи її.',newmessage:'Прочитай уточнення Олі про здавання роботи й обери безпечний спосіб.',delivery:'У віртуальному диску додай готову власну копію до папки, зазначеної у зверненні.'},
 {intro:'Прочитай звернення Максима та прийми заявку.',diagnose:'Порівняй схему мережі та відомості про принтер. Визнач, чи можна друкувати з комп’ютера Б.',printer:m?.selectedPrinter?'Принтер вибрано. Звір його з мережевою схемою та надішли документ на друк.':'У списку пристроїв вибери принтер, який відповідає умовам звернення.',sent:'Перший друк виконано. Відкрий нове повідомлення Максима.',message:'Прочитай, який пристрій вимкнули, і перевір доступність друку.',offline:m?.triedOffline?'Друк не пройшов. Тепер поясни зв’язок принтера з комп’ютером А.':'Спробуй друк у зміненій мережевій схемі та спостерігай результат.',repair:'Обери дію, яка відновлює доступ через відповідальну особу.',reprint:'Доступ відновлено. Повтори друк і перевір результат.'},
 {intro:'Прочитай повідомлення Софійки та прийми заявку.',flags:'Познач усі тривожні ознаки в повідомленні. Потім перевір свій вибір.',advice:'Склади безпечну пораду для відповіді на повідомлення незнайомця.',newMessage:'Прочитай нове повідомлення: Софійка вже передала номер. Перейди до плану допомоги.',followup:'Познач усі безпечні дії після передачі номера. Потім перевір план.',review:'Переглянь складений план допомоги та заверши заявку.'},
 {intro:'Прочитай звернення Данила про знайдене фото та прийми заявку.',diagnose:'Досліди картку фотографії. Визнач, що потрібно з’ясувати перед використанням.',action:m?.sourceViewed?'На сторінці джерела відміть потрібні відомості та перевір рішення.':'Відкрий сторінку джерела й досліди відомості про авторство та дозвіл.',update:'Надійшли конкретні умови авторки. Прочитай їх і відкрий нове завдання.',follow:'Склади підпис до фото за зазначеними умовами авторки.'},
 {intro:'Прочитай, який саме текст потрібен Насті, і прийми заявку.',diagnose:'Порівняй початковий запит із метою пошуку. Визнач причину зайвих результатів.',action:'У полі пошуковика склади точніший запит. Можна використати картки слів; потім виконай пошук.',update:'На знайденій сторінці з’явилася нова умова. Прочитай повідомлення та досліди її.',follow:'Оціни вимогу номера телефону й обери безпечний спосіб отримати текст.'},
 {intro:'Прочитай звернення Артема та прийми заявку.',diagnose:'Подивись на вкладки браузера й визнач, куди поділася попередня сторінка.',tab:'У віртуальному браузері вибери вкладку з початковою статтею.',bridge:'Першу сторінку знайдено. Прочитай уточнення про наступний перехід.',second:'Відкрий посилання в поточній вкладці й спостерігай, що змінилося.',back:'Тепер повернися до попередньої сторінки в тій самій вкладці.'},
 {intro:'Прочитай звернення Марти про спільну папку та прийми заявку.',diagnose:'Зістав стан комп’ютера А та місце зберігання папки. Визнач причину недоступності.',action:'Обери безпечний спосіб відновити доступ до спільного ресурсу.',update:'Марта знайшла локальну копію. Прочитай уточнення й перейди до наступної дії.',follow:'Порівняй локальну копію та спільний файл. Визнач, як передати зміни.'},
 {intro:'Прочитай звернення Богдана та прийми заявку.',diagnose:'Досліди лист і познач небезпечну вимогу.',action:'Склади безпечний план дій із підозрілим листом.',update:'Вкладення вже відкрито. Прочитай нове повідомлення.',follow:'Обери безпечні дії, коли невідоме вікно просить пароль.'}
 ];
 const text=stage==='done'?'Заявку завершено. Переглянь висновок, за бажанням пройди самоперевірку або обери іншу місію.':paths[i]?.[stage]||'Прочитай поточне повідомлення й виконай дію у віртуальному середовищі під ним.';
 return {title:levelsNames[i]+' · '+(stage==='done'?'завершено':'поточний крок'),text,focus:''};
}
function cityLocate(){const stage=root.querySelector('main.stage');if(!stage)return;const nodes=[...stage.querySelectorAll('textarea,input:not([type="hidden"]),[data-m1],[data-m2],[data-m3],[data-m6],[data-new],[data-answer],#next')];const n=nodes.find(x=>!x.disabled&&x.getClientRects().length)||stage.querySelector('h2')||stage;n.scrollIntoView({block:'center',behavior:'instant'});n.classList.add('academy-highlight');n.focus?.({preventScroll:true});setTimeout(()=>n.classList.remove('academy-highlight'),4500);}
function exportProgress(){return Object.fromEntries(ids.map(id=>[id,read(id)]));}
function validateImport(data){
 if(data===undefined)return null;
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('academy');
 const output={};
 for(const [id,x] of Object.entries(data)){
  if(!ids.includes(id)||!x||typeof x!=='object'||Array.isArray(x))throw Error('academy-id');
  if(Object.keys(x).length===0){output[id]=null;continue;}
  if(!Number.isInteger(x.stage)||x.stage<0||x.stage>3)throw Error('academy-stage');
  for(const field of ['errors','hints','actions'])if(x[field]!==undefined&&(!Number.isInteger(x[field])||x[field]<0||x[field]>1000000))throw Error('academy-count');
  if(id==='objects'){
   if(!['blue','mint','pink'].includes(x.color)||![120,160,200,240].includes(x.width)||typeof x.title!=='string'||x.title.length>24||![18,24,30].includes(x.size)||!['top','middle','bottom'].includes(x.place))throw Error('academy-properties');
   for(const b of ['copy','right','triangle'])if(typeof x[b]!=='boolean')throw Error('academy-flag');
   if(x.stage>=1&&(x.color!=='mint'||x.width!==240))throw Error('academy-milestone');
   if(x.stage>=2&&(x.title.trim()!=='Цифрова майстерня'||x.size!==24||x.place!=='top'))throw Error('academy-title');
   if(x.stage===3&&(!x.copy||!x.right||x.triangle))throw Error('academy-commands');
  }else if(id==='messages'){
   window.CyfroMessages.validate(x);
  }else{
   if(x.portal===2){
    if(!Array.isArray(x.safe)||x.safe.length!==3||x.safe.some(v=>!['','yes','no'].includes(v))||!Array.isArray(x.kind)||x.kind.length!==4||x.kind.some(v=>!['','Предмет','Явище'].includes(v)))throw Error('academy-choices');
    if(x.stage>=1&&x.safe.some(v=>v!=='yes'))throw Error('academy-safety');
    if(x.stage>=2&&x.kind.some((v,i)=>v!==['Явище','Предмет','Явище','Предмет'][i]))throw Error('academy-sorting');
   }else if(!Array.isArray(x.picks)||x.picks.length!==9||x.picks.some(v=>typeof v!=='string'||v.length>120))throw Error('academy-legacy');
  }
  if(JSON.stringify(x).length>12000)throw Error('academy-size');
  output[id]=JSON.parse(JSON.stringify(x));
 }
 return output;
}
function importProgress(data){
 if(!data)return;
 const before=Object.fromEntries(Object.keys(data).map(id=>[id,localStorage.getItem(keys[id])]));
 try{for(const [id,x] of Object.entries(data)){if(x===null)localStorage.removeItem(keys[id]);else localStorage.setItem(keys[id],JSON.stringify(x));}}
 catch(e){for(const [id,x] of Object.entries(before))try{if(x===null)localStorage.removeItem(keys[id]);else localStorage.setItem(keys[id],x);}catch(ignored){}throw e;}
}
function reset(){for(const id of ids)try{localStorage.removeItem(keys[id]);}catch(e){}}
function reportRows(){return ids.map(id=>{const x=lessonStatus(id);return [titles[id],x.stage,3,x.errors,x.hints];});}
function reportLines(){return ['','НАВЧАЛЬНІ ПРАКТИЧНІ МІСІЇ',...ids.map(id=>{const x=lessonStatus(id);return titles[id]+' — '+x.stage+'/3 частини; повторні перевірки: '+x.errors+'; підказки: '+x.hints;})];}
window.CyfroAcademy={home,view,mount,init,results,syncRoute,cityContext,cityLocate,exportProgress,validateImport,importProgress,reset,reportLines,reportRows};

})();
