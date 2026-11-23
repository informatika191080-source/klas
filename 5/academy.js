/* Lesson registry mounted inside the existing portal runtime. */
(function(){
"use strict";
const workshopTemplate="\n<section class=\"step\" id=\"workspace\" aria-labelledby=\"task-title\">\n<div class=\"mission-scene\" id=\"coach\"><div class=\"mission-avatar\" aria-hidden=\"true\"></div><div><b id=\"coach-name\"></b><small id=\"coach-line\"></small></div></div>\n<div class=\"task-heading\"><div><h2 id=\"task-title\"></h2><p id=\"task-text\"></p></div></div>\n<button type=\"button\" id=\"help\" hidden>Допомога</button>\n<div class=\"brief\"><h3>Замовлення команди</h3><ul id=\"requirements\"></ul></div>\n<div class=\"workbench\">\n<div class=\"editor\"><div class=\"editor-bar\"><span><span class=\"live-dot\"></span> Студія афіш</span><span id=\"selection-status\" role=\"status\">Об’єкт не вибрано</span></div>\n<div class=\"canvas\" id=\"canvas\" aria-label=\"Інтерактивна афіша. Вибери об’єкт натисканням.\">\n<div class=\"paper-heading\">ВІДКРИВАЄМО МОЖЛИВОСТІ</div>\n<button type=\"button\" class=\"art-object ribbon\" id=\"obj-ribbon\" data-object=\"ribbon\" aria-label=\"Прямокутник\" aria-pressed=\"false\"></button>\n<button type=\"button\" class=\"art-object title-object\" id=\"obj-title\" data-object=\"title\" aria-label=\"Заголовок\" aria-pressed=\"false\">Майстерня</button>\n<button type=\"button\" class=\"art-object star-object\" id=\"obj-star\" data-object=\"star\" aria-label=\"Зірка\" aria-pressed=\"false\">★</button>\n<button type=\"button\" class=\"art-object star-object\" id=\"obj-copy\" data-object=\"copy\" aria-label=\"Копія зірки\" aria-pressed=\"false\" hidden>★</button>\n<button type=\"button\" class=\"art-object triangle-object\" id=\"obj-triangle\" data-object=\"triangle\" aria-label=\"Трикутник\" aria-pressed=\"false\">▲</button>\n<div class=\"paper-caption\">ДОСЛІДЖУЙ · СТВОРЮЙ · ДІЛИСЯ</div>\n</div><div class=\"editor-foot\"><span>Натисни об’єкт, щоб працювати з ним.</span><button type=\"button\" id=\"undo\" disabled>↶ Скасувати дію</button></div></div>\n<aside class=\"inspector\" aria-labelledby=\"properties-title\"><div class=\"inspector-head\"><div class=\"eyebrow\">Панель керування</div><h3 id=\"properties-title\">Вибери об’єкт на афіші</h3></div>\n<p class=\"concept\">Програмний об’єкт використовують у програмі. Він має властивості та дії. Властивості також називають параметрами.</p>\n<dl id=\"properties\"></dl>\n<fieldset id=\"ribbon-tools\" hidden><legend>Змінити прямокутник</legend><div class=\"field-label\">Колір заливки</div><div class=\"swatches\"><button type=\"button\" data-color=\"blue\" aria-label=\"Синій\" title=\"Синій\" style=\"--swatch:#81adff\"></button><button type=\"button\" data-color=\"mint\" aria-label=\"М’ятний\" title=\"М’ятний\" style=\"--swatch:#69efd3\"></button><button type=\"button\" data-color=\"pink\" aria-label=\"Рожевий\" title=\"Рожевий\" style=\"--swatch:#ec9ccc\"></button></div><label for=\"width\">Ширина: <output id=\"width-value\" for=\"width\">120</output> умовних одиниць</label><input id=\"width\" type=\"range\" min=\"120\" max=\"240\" step=\"40\" value=\"120\"><p class=\"micro\">Повзунок змінює ширину; висота залишається сталою.</p></fieldset>\n<fieldset id=\"title-tools\" hidden><legend>Змінити заголовок</legend><label for=\"title-input\">Вміст заголовка</label><input id=\"title-input\" maxlength=\"24\" value=\"Майстерня\" autocomplete=\"off\"><label for=\"font-size\">Розмір символів</label><select id=\"font-size\"><option value=\"18\">18</option><option value=\"24\">24</option><option value=\"30\">30</option></select><label for=\"title-place\">Положення заголовка</label><select id=\"title-place\"><option value=\"middle\">Посередині</option><option value=\"top\">Угорі</option><option value=\"bottom\">Унизу</option></select></fieldset>\n<div id=\"context-tools\" hidden><button type=\"button\" id=\"context-toggle\" aria-expanded=\"false\" aria-controls=\"context-menu\">⋮ Команди об’єкта</button><p class=\"micro\">Також: права кнопка миші на об’єкті або Shift + F10.</p><div id=\"context-menu\" class=\"context-menu\" aria-label=\"Команди вибраного об’єкта\" hidden><button type=\"button\" data-command=\"duplicate\">Створити копію</button><button type=\"button\" data-command=\"right\">Перемістити праворуч</button><button type=\"button\" data-command=\"delete\">Видалити</button></div></div>\n</aside></div>\n\n<div class=\"actions\"><button type=\"button\" class=\"button\" id=\"check\">Перевірити результат →</button><span id=\"save-state\" class=\"micro\" role=\"status\"></span></div>\n</section>\n<section class=\"step finale\" id=\"finale\" hidden aria-labelledby=\"final-title\"><div class=\"eyebrow\">Замовлення виконано</div><div class=\"trophy\" aria-hidden=\"true\">🏆</div><h2 id=\"final-title\">Афішу відновлено!</h2><p>Ти керуєш програмними об’єктами: змінюєш їхні властивості та виконуєш команди.</p><div id=\"final-poster\" class=\"final-poster\"></div><ul class=\"skills\"><li>Змінено колір заливки та ширину прямокутника.</li><li>Відредаговано текст, розмір символів і положення заголовка.</li><li>Створено та переміщено копію зірки, видалено зайвий об’єкт.</li></ul><p id=\"result-summary\"></p><p class=\"micro\" id=\"completion-storage\"></p><div class=\"actions\"><button type=\"button\" class=\"btn\" data-academy-link=\"topics\">До списку пригод</button><button type=\"button\" class=\"btn secondary\" id=\"replay\">Пройти ще раз</button></div></section>\n";

const ids=['digital-class','objects','messages','web-search','media-detective','download-rescue'];
const globalInfo=id=>window.CyfroDownloads?.meta[id]||window.CyfroGlobal?.meta[id];
const titles={'digital-class':'Безпечна робота. Об’єкти та їхні властивості',objects:'Програмні об’єкти та дії над ними',messages:'Повідомлення. Органи чуття. Інформація','web-search':'Глобальна мережа · Експедиція пошуку','media-detective':'Глобальна мережа · Детективи медіа','download-rescue':'Завантаження даних · Врятуй цифрову виставку'};
// Topic order follows the teacher's semester folders; routes and save keys stay stable.
// Lesson numbers follow the source folders; 12а is the second lesson in folder 012.
const curriculum=[
 {id:'safe-work',number:'1',title:'Безпечна робота з комп’ютером. Об’єкти та їхні властивості',description:'Приготуй робоче місце та повтори основні прийоми роботи.',routes:['digital-class']},
 {id:'program-objects',number:'2',title:'Програмні об’єкти та дії над ними',description:'Досліди властивості об’єктів і виконай команди в майстерні.',routes:['objects']},
 {id:'information',number:'3',title:'Повідомлення. Отримання повідомлень людиною. Інформація',description:'Розпізнавай повідомлення та способи їх сприйняття.',routes:['messages']},
 {id:'internet-search',number:'12',title:'Глобальна мережа Інтернет. Пошук відомостей',description:'Досліди браузер і виконай пошук відомостей.',routes:['web-search']},
 {id:'media-check',number:'12а',title:'Критичне оцінювання медіатекстів',description:'Перевіряй автора, дату й докази та розпізнавай сумнівні повідомлення.',routes:['media-detective']},
 {id:'internet-downloads',number:'13',title:'Завантаження даних з Інтернету. Авторське право',description:'Збережи матеріали для виставки та перевір умови їх використання.',routes:['download-rescue']}
];
// The methodological adventure is separate from the numbered lesson curriculum.
const extraTopics=[
 {id:'networks',title:'Комп’ютерна мережа. Спільні ресурси',routes:['city/1','city/2','city/7']},
 {id:'internet-search',title:'Глобальна мережа Інтернет. Пошук відомостей',routes:['city/6','city/5']},
 {id:'media-check',title:'Критичне оцінювання медіатекстів',routes:['city/3']},
 {id:'internet-downloads',title:'Завантаження даних з Інтернету. Авторське право',routes:['city/4','city/8']}
];
const cityGroups=()=>extraTopics.map(topic=>({...topic,indices:topic.routes.map(route=>Number(route.split('/')[1])-1)}));
const cityOrder=()=>cityGroups().flatMap(topic=>topic.indices);
const routeOrder=[...curriculum.flatMap(topic=>topic.routes),...extraTopics.flatMap(topic=>topic.routes)];
const topicFor=route=>[...curriculum,...extraTopics].find(topic=>topic.routes.includes(route));
const lessonLabel=id=>'Пригода '+topicFor(id).number;
const lessonTitle=id=>lessonLabel(id)+'. '+titles[id];
function orderEntries(entries){return [...entries].sort((a,b)=>{const position=route=>{const i=routeOrder.indexOf(route);return i<0?routeOrder.length:i;};return position(a.route)-position(b.route);});}
function nextCityButton(i){const order=cityOrder(),next=order[order.indexOf(i)+1];return next===undefined?'<button class="btn" data-go="report">Диплом і результати</button>':'<button class="btn" data-ticket="'+next+'">Наступна місія</button>';}
// Every map card uses the established illustrated cover/body layout.
const cardTopic=route=>({'safe-work':'Цифрова грамотність','program-objects':'Цифрова грамотність','information':'Цифрова грамотність',networks:'Комп’ютерні мережі','internet-search':'Інтернет і пошук','media-check':'Медіаграмотність','internet-downloads':'Завантаження й авторство'}[topicFor(route)?.id]||'Мережі та інтернет');
function missionCard({route,title,description,world,face,topic,done,started,parts,next,total=3}){
 const action=route==='city'?'data-go="home"':route.startsWith('city/')?'data-ticket="'+(Number(route.split('/')[1])-1)+'"':'data-lesson="'+route+'"';
 return `<button class="mission-card curriculum-card ${done?'is-complete':''} ${next?'is-next':''}" ${action} data-world="${world}"${topicFor(route)?` aria-description="Тема: ${safe(topicFor(route).title)}"`:""}><span class="mission-cover">${window.CyfroWorld.scene(world)}<span class="card-status-pill">${done?(topicFor(route)?.number?'✓ Пригоду виконано':'✓ Місію виконано'):started?(topicFor(route)?.number?'◐ Пригода триває':'◐ Місія триває'):(topicFor(route)?.number?'✦ Нова пригода':'✦ Нова місія')}</span><span class="world-mission-token" aria-hidden="true">${done?'★':'✧'}</span><span class="face">${portrait(face)}</span></span><span class="mission-card-body"><span class="card-topic">${topicFor(route)?.number?safe(lessonLabel(route))+" · ":""}${safe(topic)}</span><strong class="mission-name">${safe(title)}</strong><span class="mission-description">${safe(description)}</span><span class="card-progress"><span class="progress-track"><i style="width:${parts/total*100}%"></i></span>${parts} із ${total} ${route==='city'?'місій':'частин'}</span><span class="card-action">${done?(topicFor(route)?.number?'Повернутися до пригоди':'Повернутися до місії'):started?(topicFor(route)?.number?'Продовжити пригоду':'Продовжити місію'):(topicFor(route)?.number?'Розпочати пригоду':'Розпочати місію')}<b aria-hidden="true">→</b></span></span></button>`;
}
function cityCard(i,next){const status=missionStatus(i),entry=routeEntry('city/'+(i+1));
 const descriptions=[
  'Допоможи Олі створити власну копію документа та передати готову роботу.',
  'Надрукуй документ на спільному принтері та віднови доступ до нього.',
  'Перевір підозрілу пропозицію та склади безпечний план дій.',
  'Перевір автора й дозвіл на використання фото та підготуй правильний підпис.',
  'Уточни пошуковий запит і знайди казку без передавання особистих даних.',
  'Знайди загублену сторінку за допомогою вкладок і кнопки «Назад».',
  'З’ясуй, чому недоступна спільна папка, та безпечно передай зміни.',
  'Розпізнай небезпечний лист і вибери дії після відкриття підозрілого вкладення.'
 ];
 return missionCard({route:entry.hash,title:levelsNames[i],description:descriptions[i],world:i===2||i===7?'messages':i===3?'workshop':'city',face:i,topic:cardTopic(entry.hash),done:status.closed,started:entry.started,parts:status.done,next:i===next});
}
function citySections(next){return '<div class="learning-cards curriculum-grid">'+cityOrder().map(i=>cityCard(i,next)).join('')+'</div>';}
const keys={'digital-class':'cyfropomich5_lesson01_v1',objects:'cyfropomich5_lesson02_v1',messages:'cyfropomich5_lesson03_v1','web-search':'cyfropomich5_web_search_v1','media-detective':'cyfropomich5_media_detective_v1','download-rescue':'cyfropomich5_download_rescue_v1'};
const read=id=>{try{const s=JSON.parse(localStorage.getItem(keys[id])||'null');return s&&typeof s==='object'?s:{};}catch(e){return {};}};
let routeLock=false,lastRouteHash=location.hash;
function lessonStatus(id){const s=read(id),stage=Math.max(0,Math.min(3,Number(s.stage)||0));const started=s.started===true||stage>0||(id==='digital-class'&&(s.safe||s.picks||[]).some(Boolean))||(id==='messages'&&(s.answers||[]).some(Boolean))||(id==='objects'&&(s.actions>0||s.color&&s.color!=='blue'||s.title&&s.title!=='Майстерня'));return {stage,finished:s.finished===true||stage===3,started,errors:Math.max(0,Number(s.errors)||0),hints:Math.max(0,Number(s.hints)||0)};}
function totalCount(){return ids.length+DATA.length;}
function totalDone(){return ids.filter(id=>lessonStatus(id).finished).length+completed();}
function routeEntry(hash){if(ids.includes(hash)){const s=lessonStatus(hash);return {hash,title:lessonTitle(hash),done:s.finished,started:s.started};}const m=/^city\/([1-8])$/.exec(hash);if(m){const i=Number(m[1])-1,st=missionStatus(i);return {hash,title:'Додаткова пригода · '+levelsNames[i],done:st.closed,started:st.done>0||cityStage(i)!=='intro'};}return null;}
function cityStage(i){return (i===0?state.m1:i===1?state.m2:i===2?state.m3:i===5?state.m6:state.mNew?.[i])?.stage||'intro';}
function recommend(){const entries=ids.map(routeEntry);let last;try{last=routeEntry(localStorage.getItem('cyfropomich5_resume_v1')||'');}catch(e){}return last&&!last.done?last:entries.find(x=>!x.done&&x.started)||entries.find(x=>!x.done)||{hash:'report',title:'Навчальні пригоди завершено',done:true,started:true};}
function remember(hash){if(!routeEntry(hash))return;try{localStorage.setItem('cyfropomich5_resume_v1',hash);}catch(e){}}
function side(id){return '<details class="mission-switcher"><summary>Усі пригоди 5 класу</summary><aside class="panel aside academy-aside"><div class="academy-side">'+ids.map(x=>'<button class="navbtn '+(x===id?'active':'')+'" data-lesson="'+x+'" '+(x===id?'aria-current="page"':'')+'>'+safe(lessonTitle(x))+'</button>').join('')+'<button class="navbtn" data-go="home">Додаткова пригода · Місту потрібна твоя допомога!</button></div></aside></details>';}
function helpIntro(){return '<details class="panel help-intro"><summary>Познайомся з командою та правилами</summary><p>Прочитай звернення → виконай завдання → перевір результат. Помилку можна виправити.</p><p>Натисни «БІП · Допомога» внизу екрана: Байт пояснить наступну дію, Піксель дасть підказку, Кібер допоможе перевірити рішення.</p>'+teamMarkup(false)+'</details>';}
function cityInvitation(){
 const done=completed(),started=DATA.some((_,i)=>routeEntry('city/'+(i+1)).started);
 return `<section class="city-invitation" aria-labelledby="extra-adventure-heading"><div class="city-invitation-copy"><span class="city-invitation-badge">✦ Додаткова пригода</span><p class="city-invitation-topic">Мережі та інтернет</p><h2 id="extra-adventure-heading">Місту потрібна<br><em>твоя допомога!</em></h2><p class="city-invitation-story">Загублені файли, принтер без зв’язку, підозрілі повідомлення… Мешканці міста чекають на твої рішення. Байт, Піксель і Кібер уже готові вирушати з тобою!</p></div><div class="city-invitation-art" aria-hidden="true"><span class="city-invitation-halo"></span><span class="city-invitation-call">Команда чекає на тебе!</span>${window.CyfroWorld.scene('city')}<span class="city-invitation-bayt">${window.CyfroVisual.character('bayt','joy')}</span><span class="city-invitation-pixel">${window.CyfroVisual.character('pixel','joy')}</span><span class="city-invitation-kiber">${window.CyfroVisual.character('kiber','explain')}</span><span class="city-invitation-stamp">8 місій<br><b>одне місто</b></span></div><div class="city-invitation-footer"><div class="city-invitation-progress"><strong>Твій поступ: ${done} із 8 місій</strong><div class="city-invitation-stars" role="progressbar" aria-label="Виконані місії міста" aria-valuemin="0" aria-valuemax="8" aria-valuenow="${done}">${cityOrder().map(i=>'<span aria-hidden="true" class="'+(missionStatus(i).closed?'is-done':'')+'">'+(missionStatus(i).closed?'★':'☆')+'</span>').join('')}</div><p>${done===8?'Диплом міста вже відкрито!':'Збери всі зірки — отримай диплом!'}</p></div><button type="button" class="btn" data-go="home">${done===8?'Повернутися до міста':started?'Продовжити пригоду':'Прийняти виклик'} <span aria-hidden="true">→</span></button></div></section>`;
}
function home(){
 const done=ids.filter(id=>lessonStatus(id).finished).length,next=recommend(),worlds={'digital-class':'classroom',objects:'workshop',messages:'messages','web-search':'city','media-detective':'messages','download-rescue':'workshop'};
 const card=id=>{const x=lessonStatus(id),meta=globalInfo(id);return missionCard({route:id,title:titles[id],description:meta?.description||(id==='digital-class'?'Підготуй клас до роботи: досліди небезпеки, об’єкти та їхні властивості.':id==='objects'?'Відкрий студію афіш: змінюй колір, текст і положення об’єктів.':'Вирушай у парк сигналів, розшифровуй повідомлення та створи два слайди.'),world:worlds[id],face:meta?.face??(id==='digital-class'?1:id==='objects'?0:2),topic:cardTopic(id),done:x.finished,started:x.started,parts:x.finished?3:x.stage,next:next.hash===id});};
 return `<main class="learning-home play-atlas" id="main-content"><section class="world-welcome"><div class="welcome-copy"><span class="world-badge">ЦИФРОПОМІЧ · 5 КЛАС</span><h1>Твій світ<br><em>цифрових пригод!</em></h1><p>Обирай кольорову локацію, допомагай героям і відкривай нові цифрові вміння!</p><div class="learning-resume"><small>${next.done?'Навчальні пригоди завершено':next.started?'Продовжимо з цього місця':'Обери пригоду для свого уроку'}</small><strong>${safe(next.title)}</strong><button class="btn" data-resume="${next.hash}">${next.done?'Переглянути досягнення':next.started?'Продовжити пригоду →':'Вирушити в пригоду →'}</button></div><div class="overall-progress"><strong>Навчальні пригоди: ${done} із ${ids.length}</strong><div class="progress-track" role="progressbar" aria-label="Завершені навчальні пригоди" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${ids.length}"><i style="width:${done/ids.length*100}%"></i></div></div></div>${window.CyfroWorld.hero()}</section><section aria-labelledby="themes-heading"><div class="world-section-heading"><div><h2 id="themes-heading">Пригоди до уроків</h2><p>Обери пригоду за номером свого уроку.</p></div><span class="tag">Усі локації відкриті</span></div><div class="learning-cards curriculum-grid">${ids.map(card).join('')}</div></section>${cityInvitation()}${helpIntro()}</main>`;
}

function view(id){
 if(!ids.includes(id))id='digital-class';
 const story=globalInfo(id)?.story||(id==='messages'?'Софійка: «Ми відкриваємо парк повідомлень. Допоможи розібрати сигнали, зробити оголошення зрозумілими та підготувати два слайди про сприйняття повідомлень».':id==='objects'?'Оля: «Ми готуємо відкриття цифрової майстерні. У макеті афіші переплутали оформлення. Допоможи відновити його та поясни, які властивості змінилися».':'Максим: «До цифрового класу завезли нові об’єкти. Допоможи підготувати безпечні місця, розібрати картки й заповнити каталог». ');
 return '<div class="game-layout">'+side(id)+'<main class="panel stage academy-mission play-portal'+(id==='messages'?' msg-portal':'')+'" id="mission" tabindex="-1"><div class="stage-top"><span class="tag">'+safe(lessonLabel(id))+' · 5 клас</span><button class="navbtn" data-go="academy">← До списку пригод</button></div><div class="ticket-header">'+window.CyfroWorld.headerArt(globalInfo(id)?.world||(id==='objects'?'workshop':id==='messages'?'messages':'classroom'))+'<div class="portrait-frame">'+portrait(globalInfo(id)?.face??(id==='objects'?0:id==='messages'?2:1))+'</div><div><span class="caps">Звернення до служби підтримки</span><h1 class="academy-title">'+safe(titles[id])+'</h1></div></div><section class="m1-call mission-request" aria-label="Звернення до служби підтримки"><strong>💬 Лист від '+(globalInfo(id)?.person||(id==='messages'?'Софійки':id==='objects'?'Олі':'Максима'))+'</strong> '+safe(story)+'</section>'+''+teamMarkup(true)+(globalInfo(id)?'<div id="global-network" class="msg-mission"></div>':id==='messages'?'<div id="messages-mission" class="msg-mission"></div>':id==='objects'?'<nav class="route" aria-label="Поступ місії"><span>Заливка й розмір</span><span>Текст і положення</span><span>Команди об’єкта</span></nav>'+workshopTemplate:'<div id="digital-class"></div>')+'</main></div>';
}
function mount(id){if(id==='download-rescue')window.CyfroDownloads.mount();else if(globalInfo(id))window.CyfroGlobal.mount(id);else if(id==='messages')window.CyfroMessages.mount();else if(id==='objects')window.CyfroWorkshopMount();else window.CyfroDigitalClass.mount();}
function navigate(id){if(!ids.includes(id))return;remember(id);closeGameNotice();state.screen='lesson';state.portalLesson=id;syncRoute('lesson',id);render();}
function syncRoute(screen,id){
 if(routeLock)return;
 const h=screen==='academy'?'topics':screen==='lesson'?(id||state.portalLesson):screen==='home'?'city':screen==='game'?'city/'+(state.ticket+1):screen;
 remember(h);if(location.hash!=='#'+h)history.pushState(null,'','#'+h);lastRouteHash=location.hash;
}
function route(){
 if(lastRouteHash===location.hash)return;lastRouteHash=location.hash;
 let h=location.hash.slice(1);if(h==='teacher'){h='topics';history.replaceState(null,'','#topics');lastRouteHash=location.hash;}routeLock=true;
 try{
  if(ids.includes(h)){state.screen='lesson';state.portalLesson=h;}
  else if(h==='topics')state.screen='academy';
  else if(/^city\/[1-8]$/.test(h)){start(Number(h.split('/')[1])-1);return;}
  else if(h==='city')state.screen='home';
  else if(!h)state.screen='academy';
  else if(['labs','report','guide'].includes(h))state.screen=h;else if(h==='finale')state.screen=completed()===8?'finale':'home';
  else if(h==='finale')state.screen=completed()===8?'finale':'home';
  else state.screen='academy';
  remember(h);render();
 }finally{routeLock=false;}
}
function results(){return '<section class="panel academy-results no-print"><div class="caps">Практичні теми</div><h2>Практичні місії</h2>'+ids.map(id=>{const x=lessonStatus(id);return '<button class="academy-result navbtn" data-lesson="'+id+'"><strong>'+safe(lessonTitle(id))+'</strong><span>'+(x.finished?'✓ Завершено':x.started?'Продовжити · '+x.stage+' із 3 частин':'Ще не розпочато')+'</span></button>';}).join('')+'</section>';}
function init(){
 window.CyfroWorkshopCharacter=window.CyfroVisual.character;
 root.addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)navigate(b.dataset.lesson);const resume=e.target.closest('[data-resume]');if(resume){const h=resume.dataset.resume;if(ids.includes(h))navigate(h);else if(/^city\/[1-8]$/.test(h))start(Number(h.split('/')[1])-1);else go('report');}const link=e.target.closest('[data-academy-link]');if(link){e.preventDefault();go('academy');}});
 document.addEventListener('cyfro-assist-open',()=>{if(!window.CyfroMission)return;window.CyfroUX.openHelper();});
 document.addEventListener('cyfro-mission-stage',()=>{if(!window.CyfroMission)return;bipReply='';bipWhatIf=false;updateBip();});
 document.addEventListener('cyfro-assist-offer',()=>{if(!window.CyfroMission)return;showGameNotice({title:'БІП поруч',text:'Бачу, що цей крок складний. Відкрий мене: поясню наступну дію або покажу інструмент.',duration:6000});});
 addEventListener('popstate',route);addEventListener('hashchange',route);
 let h=location.hash.slice(1);if(h==='teacher'){h='topics';history.replaceState(null,'','#topics');lastRouteHash=location.hash;}remember(h);if(!h)state.screen='academy';else if(ids.includes(h)){state.screen='lesson';state.portalLesson=h;}else if(h==='topics')state.screen='academy';else if(h==='city')state.screen='home';else if(/^city\/[1-8]$/.test(h)){state.screen='game';state.ticket=Number(h.split('/')[1])-1;state.step=nextMissing(state.ticket)??3;}else if(['labs','report','guide'].includes(h))state.screen=h;else if(h==='finale')state.screen=completed()===8?'finale':'home';
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
function cityLocate(){
 const scope=root.querySelector('main.stage');if(!scope)return;const i=state.ticket,m=i===0?state.m1:i===1?state.m2:i===2?state.m3:i===5?state.m6:state.mNew?.[i]||{},st=m.stage||'intro';
 const selectors=[
 {intro:'[data-m1="begin"]',diagnose:'.m1-choices',viewer:'.m1-actions',copy:'[data-m1="open-edit"]',edit:m.notes?.trim().length>=15?'[data-m1="save-copy"]':'#m1-note',newmessage:'.m1-choices',delivery:'.m1-actions'},
 {intro:'[data-m2="begin"]',diagnose:'.m2-choices',printer:m.selectedPrinter?'[data-m2="send-first"]':'.m2-choiceprint',sent:'[data-m2="new-message"]',message:'[data-m2="test-offline"]',offline:m.triedOffline?'[data-m2="diagnose-offline"]':'[data-m2="try-offline"]',repair:'.m2-actions',reprint:'[data-m2="send-again"]'},
 {intro:'[data-m3="begin"]',flags:'.m3-flags,.m3-options,[data-m3="flag"]',advice:'.m3-options,[data-m3="advice"]',newMessage:'[data-m3="follow"]',followup:'.m3-options,[data-m3="safe-action"]',review:'[data-m3="finish"]'},
 {intro:'[data-new="begin"]',diagnose:'.v4-choices,[data-new="diagnose"]',action:m.sourceViewed?'.v4-investigate':'[data-new="inspect-source"]',update:'[data-new="next"]',follow:'.v4-choices,[data-new="pick"]'},
 {intro:'[data-new="begin"]',diagnose:'.v4-choices,[data-new="diagnose"]',action:'#v4-search-input',update:'[data-new="next"]',follow:'.v4-choices,[data-new="site"]'},
 {intro:'[data-m6="begin"]',diagnose:'.m6-choices',tab:m.firstDone?'[data-m6="bridge"]':'.m6-bar',bridge:'[data-m6="second"]',second:m.visited?'[data-m6="go-back-stage"]':'[data-m6="follow"]',back:m.visited?'[data-m6="back"]':'[data-m6="finish"]'},
 {intro:'[data-new="begin"]',diagnose:'[data-new="diagnose"]',action:m.hostOn?'[data-new="check-folder"]':'[data-new="power"]',update:'[data-new="next"]',follow:!m.localEdited?'[data-new="edit-local"]':!m.accessInspected?'[data-new="inspect-access"]':!m.uploadPermission?'[data-new-check="permission"]':'[data-new="upload"]'},
 {intro:'[data-new="begin"]',diagnose:'[data-new="flag"]',action:m.mailReviewed?'[data-new="advice"]':'[data-new="inspect-mail"]',update:'[data-new="next"]',follow:'[data-new="pick"]'}
 ];const selector=st==='done'?'[data-ticket],[data-go="report"],[data-go="home"]':selectors[i]?.[st];let target=selector?scope.querySelector(selector):null;if(!target||target.disabled||!target.getClientRects().length)target=scope.querySelector('h2')||scope;target.scrollIntoView({block:'center',behavior:'instant'});target.classList.add('academy-highlight');if(target.tabIndex<0)target.tabIndex=-1;target.focus({preventScroll:true});setTimeout(()=>target.classList.remove('academy-highlight'),4500);
}

function exportProgress(){return Object.fromEntries(ids.map(id=>[id,read(id)]));}
function validateImport(data){
 if(data===undefined)return null;
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('academy');
 const output={};
 for(const [id,x] of Object.entries(data)){
  if(!ids.includes(id)||!x||typeof x!=='object'||Array.isArray(x))throw Error('academy-id');
  if(Object.keys(x).length===0){output[id]=null;continue;}
  if(!Number.isInteger(x.stage)||x.stage<0||x.stage>3)throw Error('academy-stage');
  for(const flag of ['started','finished'])if(x[flag]!==undefined&&typeof x[flag]!=='boolean')throw Error('academy-flag');
  for(const field of ['errors','hints','actions'])if(x[field]!==undefined&&(!Number.isInteger(x[field])||x[field]<0||x[field]>1000000))throw Error('academy-count');
  if(id==='objects'){
   if(!['blue','mint','pink'].includes(x.color)||![120,160,200,240].includes(x.width)||typeof x.title!=='string'||x.title.length>24||![18,24,30].includes(x.size)||!['top','middle','bottom'].includes(x.place))throw Error('academy-properties');
   for(const b of ['copy','right','triangle'])if(typeof x[b]!=='boolean')throw Error('academy-flag');
   if(x.stage>=1&&(x.color!=='mint'||x.width!==240))throw Error('academy-milestone');
   if(x.stage>=2&&(x.title.trim()!=='Цифрова майстерня'||x.size!==24||x.place!=='top'))throw Error('academy-title');
   if(x.stage===3&&(!x.copy||!x.right||x.triangle))throw Error('academy-commands');
  }else if(id==='download-rescue'){
   window.CyfroDownloads.validate(x);
  }else if(globalInfo(id)){
   window.CyfroGlobal.validate(id,x);
  }else if(id==='messages'){
   window.CyfroMessages.validate(x);
  }else{
   if(x.portal===2){
    if(!Array.isArray(x.safe)||x.safe.length!==3||x.safe.some(v=>!['','yes','no'].includes(v))||!Array.isArray(x.kind)||x.kind.length!==4||x.kind.some(v=>!['','Предмет','Явище'].includes(v)))throw Error('academy-choices');
    if(x.stage>=1&&x.safe.some(v=>v!=='yes'))throw Error('academy-safety');
    if(x.stage>=2&&x.kind.some((v,i)=>v!==['Явище','Предмет','Явище','Предмет'][i]))throw Error('academy-sorting');
    if(!['','Гума','Дерево','Папір'].includes(x.material)||!['','Помаранчевий','Зелений','Синій'].includes(x.color))throw Error('academy-property');
    for(const flag of ['followup','moved'])if(typeof x[flag]!=='boolean')throw Error('academy-action');
    if(!['','position','color','material'].includes(x.observed))throw Error('academy-observation');
    if(x.stage===3&&(x.material!=='Гума'||!x.color||!x.followup||!x.moved||x.observed!=='position'))throw Error('academy-final');
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
function reset(){try{localStorage.removeItem('cyfropomich5_success_v1');}catch(e){}try{localStorage.removeItem('cyfropomich5_resume_v1');}catch(e){}for(const id of ids)try{localStorage.removeItem(keys[id]);}catch(e){}}
function catalog(){return ids.map(id=>({id,number:topicFor(id).number,title:lessonTitle(id),storageKey:keys[id]}));}
function reportRows(){return ids.map(id=>{const x=lessonStatus(id);return [lessonTitle(id),x.finished?3:x.stage,3,x.errors,x.hints];});}
function reportLines(){return ['','НАВЧАЛЬНІ ПРАКТИЧНІ МІСІЇ',...ids.map(id=>{const x=lessonStatus(id);return lessonTitle(id)+' — '+(x.finished?3:x.stage)+'/3 частини; повторні перевірки: '+x.errors+'; підказки: '+x.hints;})];}
window.CyfroAcademy={curriculum,cityGroups,cityOrder,topicFor,orderEntries,nextCityButton,cityCard,citySections,catalog,lessonStatus,totalDone,totalCount,recommend,remember,home,view,mount,init,results,syncRoute,cityContext,cityLocate,exportProgress,validateImport,importProgress,reset,reportLines,reportRows};

})();

