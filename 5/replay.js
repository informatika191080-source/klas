/* Repeat a completed activity without erasing its prior achievement or product. */
(function(){
'use strict';
const KEY='cyfropomich5_completed_attempts_v1';
const supported=['data-processes','web-search','media-detective','download-rescue'];
function validate(data){if(data===undefined)return {};if(!data||typeof data!=='object'||Array.isArray(data)||Object.keys(data).some(id=>!supported.includes(id)))throw Error('replay-format');const checked=window.CyfroAcademy.validateImport(data);for(const x of Object.values(checked))if(!x||x.stage!==3||x.finished!==true)throw Error('replay-incomplete');return checked;}
function read(){try{return validate(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return {};}}
function completed(id){return !!read()[id];}
function importProgress(data){const checked=validate(data);if(Object.keys(checked).length)localStorage.setItem(KEY,JSON.stringify(checked));else localStorage.removeItem(KEY);}
function reset(){localStorage.removeItem(KEY);}
function restartLesson(id){
 if(!supported.includes(id))throw Error('replay-id');const def=window.CyfroAcademy.catalog().find(x=>x.id===id);if(!def)throw Error('replay-id');
 const before=localStorage.getItem(def.storageKey),beforeArchive=localStorage.getItem(KEY),current=JSON.parse(before||'null');const checked=window.CyfroAcademy.validateImport({[id]:current})[id];if(!checked||checked.stage!==3||!checked.finished)throw Error('replay-not-finished');
 const previous=validate(JSON.parse(beforeArchive||'{}'));previous[id]=checked;
 const fresh=id==='data-processes'?window.CyfroData.defaults():id==='download-rescue'?window.CyfroDownloads.defaults():window.CyfroGlobal.defaults(id);fresh.started=true;
 try{localStorage.setItem(KEY,JSON.stringify(previous));localStorage.setItem(def.storageKey,JSON.stringify(fresh));}
 catch(e){try{if(beforeArchive===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,beforeArchive);if(before===null)localStorage.removeItem(def.storageKey);else localStorage.setItem(def.storageKey,before);}catch(ignored){}throw e;}
 return fresh;
}
function restartCity(i){
 if(!Number.isInteger(i)||i<0||i>7||![0,1,2].every(j=>typeof state.results[(i+1)+'-'+j]==='boolean'))throw Error('replay-city');
 if(i===0)state.m1={replaying:true,stage:'intro',view:'shared',copyMade:false,edited:false,submitted:false,mistakes:0,notes:''};
 else if(i===1)state.m2={replaying:true,stage:'intro',hostOn:true,selectedPrinter:'',sent:false,triedOffline:false,mistakes:0};
 else if(i===2)state.m3={replaying:true,stage:'intro',flags:[],safeActions:[],mistakes:0};
 else if(i===5)state.m6={replaying:true,stage:'intro',tab:'new',visited:false,firstDone:false,mistakes:0};
 else{if(!state.mNew||typeof state.mNew!=='object')state.mNew={};delete state.mNew[i];newMissionState(i).replaying=true;}
 state.ticket=i;state.step=0;state.selected=null;persist();start(i);
}
function ensure(){
 if(typeof state==='undefined'||typeof root==='undefined')return;
 if(state.screen==='lesson'&&supported.includes(state.portalLesson)){
  const id=state.portalLesson,def=window.CyfroAcademy.catalog().find(x=>x.id===id);let current;try{current=JSON.parse(localStorage.getItem(def.storageKey)||'null');}catch(e){return;}if(!current)return;
  const scope=root.querySelector('main.stage');if(!scope)return;
  if(current.stage===3){const back=scope.querySelector('[data-academy-link="topics"]');const row=back?.closest('.actions,.foot')||back?.parentElement;if(row&&!row.querySelector('[data-repeat-lesson]')){const b=document.createElement('button');b.type='button';b.className='navbtn';b.dataset.repeatLesson=id;b.textContent='Пройти ще раз';back.before(b);}}
  else if(completed(id)&&!scope.querySelector('[data-replay-note]')){const p=document.createElement('p');p.className='tiny';p.dataset.replayNote='';p.setAttribute('role','status');p.textContent='Повторення: попереднє завершення та готову роботу збережено. Нове проходження починається з першого кроку.';const target=scope.querySelector('#data-processes,#global-network');target?.prepend(p);}
 }else if(state.screen==='game'){
  const done=root.querySelector('main.stage .mission-done');if(!done||[...done.querySelectorAll('button')].some(b=>b.textContent.includes('Пройти ще раз')))return;
  const row=done.querySelector('.m1-foot,.m2-footer,.m3-actions,.m6-footer,.v4-row')||done.lastElementChild;
  if(row){const b=document.createElement('button');b.type='button';b.className='btn ghost';b.dataset.repeatCity=String(state.ticket);b.textContent='Пройти ще раз';row.append(b);}
 }
}
let bound=false,observer;
function bind(){if(bound)return;bound=true;root.addEventListener('click',e=>{const b=e.target.closest('[data-repeat-lesson],[data-repeat-city]');if(!b)return;e.preventDefault();try{if(b.dataset.repeatLesson){restartLesson(b.dataset.repeatLesson);window.CyfroUX.dismissSuccess();render();}else restartCity(Number(b.dataset.repeatCity));}catch(error){let p=root.querySelector('[data-replay-error]');if(!p){p=document.createElement('p');p.dataset.replayError='';p.className='tiny';p.setAttribute('role','alert');b.after(p);}p.textContent='Не вдалося зберегти попередній результат. Поточну роботу не скинуто. Збережи прогрес у файл і спробуй знову.';}});observer=new MutationObserver(ensure);observer.observe(root,{childList:true,subtree:true});ensure();}
window.CyfroReplay={KEY,supported,validate,exportProgress:read,importProgress,completed,restartLesson,restartCity,bind,ensure,reset};
})();
