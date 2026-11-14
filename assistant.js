/* Shared contextual BIP for all academy pages except the existing 8-mission game. */
(function(){
"use strict";
if(document.getElementById("cyfro-assistant"))return;
const rootBase=new URL(".",document.currentScript.src).href;
const path=location.pathname;
const lesson=/\/5\/lesson-01\.html$/.test(path);
const grade=path.match(/\/([5-9])\/(?:index\.html)?$/)?.[1];
const css=[
'#cyfro-assistant{position:fixed;z-index:2000;right:14px;bottom:max(14px,env(safe-area-inset-bottom));font:14px/1.5 system-ui,sans-serif;color:#143550}',
'#cyfro-assistant *{box-sizing:border-box}',
'#cyfro-assistant button{cursor:pointer;font:inherit}',
'#cyfro-assistant button:focus-visible,#cyfro-assistant a:focus-visible{outline:3px solid #ffe283;outline-offset:2px}',
'#cyfro-assistant .bip-launch{height:65px;width:65px;border:2px solid #9ff9fb;border-radius:22px;background:linear-gradient(135deg,#3de5ec,#1571c2);font-size:32px;box-shadow:0 12px 30px #0009;animation:bip-hover 4s ease-in-out infinite}',
'#cyfro-assistant .bip-panel{width:min(350px,calc(100vw - 24px));max-height:min(70dvh,530px);overflow-y:auto;margin-bottom:10px;padding:16px;border:2px solid #7cd8ec;border-radius:19px;background:#f2faff;color:#153950;box-shadow:0 15px 44px #000a}',
'#cyfro-assistant .bip-panel[hidden],#cyfro-assistant .bip-invite[hidden]{display:none}',
'#cyfro-assistant .bip-top{display:flex;gap:8px;align-items:center;margin-bottom:10px}',
'#cyfro-assistant .bip-top strong{font-size:17px;flex:1}',
'#cyfro-assistant .bip-close{width:38px;height:38px;background:#d9eaf3;color:#24445b;border:1px solid #89b6d4;border-radius:9px;font-size:23px}',
'#cyfro-assistant p{margin:8px 0 13px}',
'#cyfro-assistant .bip-choices{display:grid;gap:7px}',
'#cyfro-assistant .bip-choices button,#cyfro-assistant .bip-choices a{display:block;border:1px solid #87b2c8;border-radius:10px;min-height:43px;padding:10px 12px;background:#e2f2fb;color:#17415a;text-decoration:none;text-align:left;font-size:13px;font-weight:750}',
'#cyfro-assistant .bip-invite{position:absolute;right:0;bottom:77px;width:min(245px,calc(100vw - 98px));background:#f2faff;color:#153950;padding:10px 12px;border:1px solid #87ddeb;border-radius:12px;box-shadow:0 6px 20px #0009;font-size:12px;font-weight:750}',
'@keyframes bip-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}',
'@media(max-width:600px){#cyfro-assistant{right:9px;bottom:max(9px,env(safe-area-inset-bottom))}#cyfro-assistant .bip-launch{height:56px;width:56px;font-size:28px}#cyfro-assistant .bip-invite{bottom:66px}#cyfro-assistant .bip-panel{padding:12px}}',
'#cyfro-assistant .bip-launch{background:linear-gradient(135deg,#74f5d5,#8baeff);border:2px solid #a6f8f2;color:#07152b;box-shadow:0 10px 30px #46e6d452}',
'#cyfro-assistant .bip-panel{background:linear-gradient(145deg,#192843,#121c32);color:#eef5ff;border:1px solid #81adff;box-shadow:0 15px 55px #0009;border-radius:22px}',
'#cyfro-assistant .bip-heading,#cyfro-assistant .bip-top strong{color:#f4faff}',
'#cyfro-assistant .bip-close{background:#263555;border:1px solid #ffffff40;color:#f5faff}',
'#cyfro-assistant .bip-choices button,#cyfro-assistant .bip-choices a{background:#263555;border:1px solid #7088b8;color:#f2f7ff;border-radius:12px}',
'#cyfro-assistant .bip-choices button:hover,#cyfro-assistant .bip-choices a:hover{background:#335478;border-color:#69efd3}',
'#cyfro-assistant .bip-invite{background:#192843;color:#f2f7ff;border:1px solid #77c9d3;border-radius:15px}',
'@media(prefers-reduced-motion:reduce){#cyfro-assistant .bip-launch{animation:none}}'
].join('\n');
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
const host=document.createElement("aside");host.id="cyfro-assistant";
host.innerHTML='<div class="bip-invite" role="status"></div><section class="bip-panel" aria-label="Допомога БІПа" hidden><div class="bip-top"><span aria-hidden="true">🤖</span><strong>БІП допомагає</strong><button type="button" class="bip-close" aria-label="Закрити">×</button></div><p class="bip-text"></p><div class="bip-choices"><button type="button" data-bip-answer="help">❓ Щось незрозуміло</button><button type="button" data-bip-answer="next">🧭 Що робити далі?</button><button type="button" data-bip-answer="hint">💡 Дай підказку</button><a class="bip-home" href="'+rootBase+'">🏠 На головну</a></div></section><button type="button" class="bip-launch" aria-expanded="false" aria-label="Відкрити цифрового помічника">🤖</button>';
document.body.appendChild(host);
const panel=host.querySelector(".bip-panel"),toggle=host.querySelector(".bip-launch"),invite=host.querySelector(".bip-invite"),msg=host.querySelector(".bip-text");
const page=lesson?"mission":grade?"grade"+grade:"home";
let hideTimer=null,offerTimer=null,lastIssue=null;
document.addEventListener("cyfro-mission-result",e=>{
 const d=e.detail||{};
 lastIssue=d.ok?null:{step:Number(d.step),card:Number(d.card)};
});
function currentStep(){return [...document.querySelectorAll("[data-step]")].findIndex(n=>!n.hidden)}
function answer(type){
 if(lesson){
  const i=currentStep();
  if(i===0)msg.textContent=type==="hint"?(lastIssue?.step===0&&lastIssue.card===0?"Поміркуй, хто повинен перевіряти пошкоджений кабель.":lastIssue?.step===0&&lastIssue.card===1?"Що станеться, якщо напій проллється біля клавіатури?":lastIssue?.step===0&&lastIssue.card===2?"Хто має вирішувати, що робити, якщо комп’ютер несправний?":"Перевір, чи безпечно торкатися несправного обладнання. Хто може допомогти?"):type==="next"?"Розглянь три ситуації, обери безпечну дію в кожній і натисни «Перевірити».":"Ти перевіряєш робоче місце. Для кожної ситуації потрібно знайти безпечне рішення.";
  else if(i===1)msg.textContent=type==="hint"?(lastIssue?.step===1?"У картці, яку потрібно перевірити, названо "+["дощ","комп’ютер","рух велосипеда","олівець"][lastIssue.card]+". Це річ чи явище?":"Чи можна доторкнутися до предмета? А що означає явище?"):type==="next"?"Визнач тип усіх чотирьох об’єктів і натисни «Перевірити».":"Зверни увагу на різницю між предметом і явищем.";
  else if(i===2)msg.textContent=type==="hint"?"Згадай, із чого зазвичай виготовляють пружні м’ячі. А колір моделі можна обрати на свій смак.":type==="next"?"Вибери матеріал і колір м’яча, а потім перевір картку.":"Потрібно описати один предмет за двома властивостями.";
  else msg.textContent="Вітаю! Ти завершив місію. Можеш повернутися до інших завдань.";
 }else if(grade){
  msg.textContent=document.querySelector(".topic a.action")?(type==="hint"?"Зверни увагу на назву місії та її завдання.":type==="next"?"Натисни кнопку місії, щоб відкрити навчальну пригоду.":"Тут ти обираєш навчальні місії свого класу."): "Це сторінка твого класу. Щоб повернутися на головну, скористайся кнопкою вгорі.";
 }else{
  msg.textContent=type==="hint"?"Шукай картку зі своїм класом — на ній велика цифра.":type==="next"?"Натисни картку свого класу.":"На головній сторінці потрібно обрати клас від 5 до 9.";
 }
}
function close(){panel.hidden=true;toggle.setAttribute("aria-expanded","false")}
function open(){panel.hidden=false;invite.hidden=true;clearTimeout(hideTimer);toggle.setAttribute("aria-expanded","true");answer("help")}
toggle.addEventListener("click",()=>panel.hidden?open():close());
host.querySelector(".bip-close").addEventListener("click",close);
host.addEventListener("click",e=>{const button=e.target.closest("[data-bip-answer]");if(button)answer(button.dataset.bipAnswer)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)close()});
invite.textContent=lesson?"Я БІП! Потрібна підказка? Натисни на мене.":grade?"Привіт! Я БІП, твій цифровий помічник.":"Привіт! Я БІП. Допоможу обрати твій клас.";
document.addEventListener("cyfro-assist-offer",()=>{
 clearTimeout(offerTimer);
 // Delay the invitation until the mission's existing result popup has disappeared.
 offerTimer=setTimeout(()=>{
  if(!panel.hidden||document.hidden)return;
  invite.textContent="Складно? Натисни на мене — підкажу, як міркувати.";
  invite.hidden=false;clearTimeout(hideTimer);
  hideTimer=setTimeout(()=>invite.hidden=true,6200);
 },5800);
});
try{
 if(sessionStorage.getItem("cyfro-bip-invite-"+page))invite.hidden=true;
 else{sessionStorage.setItem("cyfro-bip-invite-"+page,"1");hideTimer=setTimeout(()=>invite.hidden=true,6500)}
}catch(e){hideTimer=setTimeout(()=>invite.hidden=true,6500)}
})();
