/* Shared reading, focus and feedback behavior for every mission. */
(function(){
'use strict';
const focusAttrs=['data-safe','data-value','data-object-card','data-bin','data-material','data-ball-color','data-observed','data-msg-sample','data-msg-answer','data-msg-meaning','data-msg-channel','data-msg-combined-sense','data-msg-slide','data-msg-slide-sense','data-class-check','data-class-back','data-msg-check','data-msg-back','data-m1','data-m2','data-m3','data-m6','data-new','data-val','data-pick','data-seq','data-tab','data-reflection'];
function capture(scope){
 const el=document.activeElement;if(!el||!scope.contains(el)||el===document.body)return null;
 const attrs=focusAttrs.filter(a=>el.hasAttribute(a)).map(a=>[a,el.getAttribute(a)]);
 return {id:el.id,tag:el.tagName,attrs,start:el.selectionStart,end:el.selectionEnd};
}
function restore(snapshot,scope){
 if(!snapshot)return;
 const el=snapshot.id?scope.querySelector('#'+CSS.escape(snapshot.id)):snapshot.attrs.length?[...scope.querySelectorAll(snapshot.tag)].find(n=>snapshot.attrs.every(([a,v])=>n.getAttribute(a)===v)):null;
 if(!el||el.disabled||!el.getClientRects().length)return;
 el.focus({preventScroll:true});if(typeof snapshot.start==='number'&&el.setSelectionRange)try{el.setSelectionRange(snapshot.start,snapshot.end);}catch(e){}
}
function step(scope){
 const heading=scope.querySelector('h2,h1,h3')||scope;
 heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
 heading.scrollIntoView({block:'start',behavior:'instant'});
}
function feedback({title,text,kind='info',actions=[]}){
 const scope=document.querySelector('main.stage, main.lab-layout, .labs, main');if(!scope)return false;
 let box=document.getElementById('mission-notice');
 if(!box){box=document.createElement('section');box.id='mission-notice';box.className='mission-feedback';box.setAttribute('role','status');box.setAttribute('aria-live','polite');box.setAttribute('tabindex','-1');const anchor=[...scope.querySelectorAll('.foot,.m1-foot,.m2-footer,.m3-actions:last-child,.m6-footer,.v4-footer,.actions')].find(n=>n.getClientRects().length);if(anchor)anchor.before(box);else scope.append(box);}
 if(!box.getClientRects().length){const anchor=[...scope.querySelectorAll('.foot,.actions')].find(n=>n.getClientRects().length);if(anchor)anchor.before(box);else scope.append(box);}
 box.dataset.kind=kind;box.replaceChildren();const strong=document.createElement('strong'),p=document.createElement('p');strong.textContent=title;p.textContent=text;box.append(strong,p);
 if(actions.includes('pixel')){const b=document.createElement('button');b.type='button';b.className='navbtn';b.textContent='БІП, поясни цей крок';b.onclick=()=>openHelper('context');box.append(b);}
 if(['error','bad'].includes(kind)){box.focus({preventScroll:true});box.scrollIntoView({block:'nearest',behavior:'instant'});}
 return true;
}
let helperOrigin=null;
function openHelper(action='context'){
 helperOrigin=document.activeElement;closeGameNotice();bipPanelOpen=true;bipIsNew=false;bipWhatIf=false;
 if(action==='hint')bipOpenHint();else if(action==='risk')bipReply=window.CyfroMission?window.CyfroMission.help('risk'):state.screen==='game'?KIBER_RULES[state.ticket][coachPhase()==='b'?1:0]:'Усі дії відбуваються у навчальній симуляції.';else bipReply=bipContext().text;
 updateBip();document.querySelector('[data-bip-close]')?.focus({preventScroll:true});
}
function closeHelper(){bipPanelOpen=false;updateBip();const origin=helperOrigin;helperOrigin=null;if(origin?.isConnected)origin.focus({preventScroll:true});else document.querySelector('[data-bip-open]')?.focus({preventScroll:true});}
function revealFeedback(){const el=document.querySelector('main.stage [id$="-feedback"]');if(el&&el.textContent.trim()){el.tabIndex=-1;el.focus({preventScroll:true});el.scrollIntoView({block:'nearest',behavior:'instant'});}}
function afterRender(){
 document.body.dataset.screen=state.screen;
 const main=root.querySelector('main')||root.querySelector('.hero');if(main&&!main.id)main.id='main-content';const skip=document.querySelector('.skip-link');if(skip&&main)skip.href='#'+main.id;
 root.querySelectorAll('main.stage').forEach(n=>{if(!n.id)n.id='mission';n.tabIndex=-1;});
 root.querySelectorAll('.side-nav button.current,.academy-side .active').forEach(n=>n.setAttribute('aria-current','page'));
 const side=root.querySelector('.game-layout > .aside,.game-layout > div > .aside');
 if(side&&!side.closest('details')){const menu=document.createElement('details');menu.className='mission-switcher';const summary=document.createElement('summary');summary.textContent='Інші місії цієї теми';side.before(menu);menu.append(summary,side);const wrap=menu.parentElement;if(wrap?.parentElement?.classList.contains('game-layout')&&wrap.children.length===1)wrap.replaceWith(menu);}
 const activeStage=root.querySelector('main.stage');
 if(activeStage&&state.screen==='game'){
  const title=activeStage.querySelector('.m1-head h2,.m2-head h2,.m3-head h2,.m6-head h2,.v4-heading h2');if(title){const h=document.createElement('h1');for(const a of title.attributes)h.setAttribute(a.name,a.value);h.className='mission-heading';h.innerHTML=title.innerHTML;title.replaceWith(h);}
  const track=activeStage.querySelector('[role="progressbar"],.m1-progress,.m6-progress,.v4-track');
  if(track){const label=document.createElement('p');label.className='task-progress-label';const phase=coachPhase()==='b'?'Уточнення та завершення':'Початкове звернення';label.textContent=coachStage()==='done'?'✓ Місію завершено':(missionStatus(state.ticket).closed?'Повторне тренування · ':'')+phase;track.before(label);}
 }
 root.querySelectorAll('a[href="#topics"]').forEach(a=>a.setAttribute('aria-label','Повернутися до мапи тем'));
}
document.addEventListener('click',e=>{if(!e.target.closest('.skip-link'))return;e.preventDefault();const main=root.querySelector('main');if(main)step(main);});
window.CyfroUX={revealFeedback,capture,restore,step,feedback,openHelper,closeHelper,afterRender};
})();
