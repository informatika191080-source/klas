/* Shared portal support. The game uses this same visual component in its runtime. */
(function(){
'use strict';
if(document.getElementById('live-bip-root')||!window.CyfroVisual)return;
const grade=document.body.dataset.grade,home=!grade,host=document.createElement('aside');host.id='live-bip-root';host.className='live-bip no-print';document.body.append(host);
let origin=null;let open=false,reply='',isNew=true,highlightTimer;
const context=()=>({title:home?'Обери свій клас':grade+' клас',text:home?'Привіт! Я БІП. Обери свій клас на картці нижче. Я допоможу розібратися з навігацією.':'Ти на сторінці '+grade+' класу. На головну можна повернутися кнопкою вгорі.'});
function draw(){host.innerHTML=window.CyfroVisual.bipMarkup({context:context(),open,reply,isNew,locate:true,mode:'navigation'});const actions=host.querySelector('.live-bip-actions');actions.querySelector('[data-bip-action="consequences"]')?.remove();}
function show(text){open=true;isNew=false;reply=text;draw();}
host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-bip-open')){origin=document.activeElement;open=!open;isNew=false;reply='';draw();if(open)host.querySelector('[data-bip-close]')?.focus({preventScroll:true});return;}if(b.hasAttribute('data-bip-close')){open=false;draw();(origin?.isConnected?origin:host.querySelector('[data-bip-open]'))?.focus({preventScroll:true});return;}
const a=b.dataset.bipAction;if(a==='locate'){const target=home?document.querySelector('.academy-grade'):document.querySelector('.portal-home-link');if(target){open=false;draw();target.scrollIntoView({block:'center',behavior:'instant'});target.classList.add('academy-highlight');target.focus();clearTimeout(highlightTimer);highlightTimer=setTimeout(()=>target.classList.remove('academy-highlight'),4500);}return;}
reply=a==='context'?context().text:a==='hint'?(home?'На кожній картці велика цифра. Знайди свій клас і натисни цю картку.':'Кнопка «На головну» розташована в шапці сторінки.'):home?'Спочатку обери клас, потім тему. У місії БІП підкаже наступний крок, ПІКСЕЛЬ пояснить ознаки, КІБЕР — наслідки.':'БІП пояснює поточну дію. Під час місій підказки стосуються конкретного завдання.';draw();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){open=false;draw();host.querySelector('[data-bip-open]').focus();}});
document.querySelectorAll('[data-static-character]').forEach(n=>n.innerHTML=window.CyfroVisual.character(n.dataset.staticCharacter,'joy'));
document.addEventListener('click',e=>{const b=e.target.closest('[data-static-role]');if(!b)return;show(b.dataset.staticRole==='bayt'?context().text:b.dataset.staticRole==='pixel'?(home?'Почни з картки свого класу.':'На головну можна повернутися кнопкою вгорі.'):'Під час навчання всі дії виконуються у віртуальних середовищах. Справжні паролі й особисті дані вводити не потрібно.');});
draw();
})();
