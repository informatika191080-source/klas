/* Existing academy characters, reused without changing the original mission. */
(function(){
"use strict";
function mascotArt(kind,mood="neutral"){
 const wide=mood==="surprise",happy=["joy","celebrate","explain"].includes(mood);
 const eyes=wide?'<ellipse cx="58" cy="78" rx="7" ry="12"/><ellipse cx="104" cy="78" rx="7" ry="12"/>':happy?'<path d="M48 78q10-14 20 0M94 78q10-14 20 0" fill="none" stroke="#13caff" stroke-width="7" stroke-linecap="round"/>':'<ellipse cx="58" cy="78" rx="6" ry="10"/><ellipse cx="104" cy="78" rx="6" ry="10"/>';
 const mouth=wide?'<ellipse cx="81" cy="105" rx="8" ry="12" fill="#0b2448" stroke="#4be0ff" stroke-width="3"/>':mood==="think"?'<path d="M68 108q13-7 26-2" stroke="#35caff" stroke-width="4" fill="none" stroke-linecap="round"/>':happy?'<path d="M63 104q18 24 37 0Z" fill="#e53e7b" stroke="#45e1ff" stroke-width="3"/>':'<path d="M66 103q15 13 30 0" stroke="#35caff" stroke-width="4" fill="none" stroke-linecap="round"/>';
 if(kind==="bayt")return '<svg viewBox="0 0 164 184" role="img" aria-label="Байт">'+
 '<defs><linearGradient id="baytMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#a4d7fa"/></linearGradient></defs>'+
 '<g class="mascot-arm-left"><path d="M46 131L21 147" stroke="#c9ebff" stroke-width="17" stroke-linecap="round"/><circle cx="19" cy="149" r="10" fill="#13afff" stroke="#083d7d" stroke-width="4"/></g>'+
 '<g class="mascot-arm-right"><path d="M119 129L145 '+(happy?'108':'143')+'" stroke="#c9ebff" stroke-width="17" stroke-linecap="round"/><circle cx="145" cy="'+(happy?'106':'144')+'" r="10" fill="#12baf4" stroke="#083d7d" stroke-width="4"/></g>'+
 '<path d="M58 134L49 165M107 134L115 165" stroke="#dff5ff" stroke-width="16" stroke-linecap="round"/><ellipse cx="48" cy="168" rx="18" ry="10" fill="#088ceb" stroke="#042b62" stroke-width="4"/><ellipse cx="117" cy="168" rx="18" ry="10" fill="#088ceb" stroke="#042b62" stroke-width="4"/>'+
 '<rect x="48" y="107" width="67" height="47" rx="22" fill="url(#baytMetal)" stroke="#195194" stroke-width="5"/><circle cx="82" cy="131" r="14" fill="#05c7ef" stroke="#148acc" stroke-width="4"/><path d="M82 119v16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'+
 '<path d="M81 16V8" stroke="#39dfff" stroke-width="5"/><circle cx="81" cy="8" r="7" fill="#0cf3fd" stroke="#143a83" stroke-width="3"/>'+
 '<rect x="22" y="22" width="119" height="104" rx="43" fill="url(#baytMetal)" stroke="#103f83" stroke-width="6"/><ellipse cx="82" cy="74" rx="47" ry="39" fill="#04142a" stroke="#1aa9f4" stroke-width="4"/>'+
 '<g fill="#18e9ff">'+eyes+'</g>'+mouth+
 '<circle cx="24" cy="79" r="13" fill="#10c9ff" stroke="#1162a4" stroke-width="5"/><circle cx="141" cy="79" r="13" fill="#10c9ff" stroke="#1162a4" stroke-width="5"/></svg>';
 if(kind==="pixel"){
  const eye=wide?'<ellipse cx="64" cy="80" rx="6" ry="10"/><ellipse cx="101" cy="80" rx="6" ry="10"/>':happy?'<path d="M55 80q10-13 18 0M92 80q10-13 18 0" fill="none" stroke="#2c1b4f" stroke-width="5" stroke-linecap="round"/>':'<ellipse cx="64" cy="80" rx="5" ry="8"/><ellipse cx="101" cy="80" rx="5" ry="8"/>';
  const smile=wide?'<ellipse cx="83" cy="104" rx="7" ry="11" fill="#40255f"/>':mood==="think"?'<path d="M74 105h17" stroke="#3b2468" stroke-width="4" stroke-linecap="round"/>':'<path d="M70 99q13 20 26 0" fill="#e95a83" stroke="#3b2468" stroke-width="3"/>';
  return '<svg viewBox="0 0 164 184" role="img" aria-label="Піксель">'+
  '<g class="mascot-arm-left"><path d="M48 107L22 126" stroke="#7440d8" stroke-width="11" stroke-linecap="round"/><circle cx="19" cy="127" r="9" fill="#fff" stroke="#6c40b6" stroke-width="3"/></g>'+
  '<g class="mascot-arm-right"><path d="M115 104L145 '+(happy?'87':'126')+'" stroke="#7440d8" stroke-width="11" stroke-linecap="round"/><circle cx="145" cy="'+(happy?'85':'127')+'" r="9" fill="#fff" stroke="#6c40b6" stroke-width="3"/></g>'+
  '<path d="M62 126L53 161M99 126L109 161" stroke="#8e55d5" stroke-width="12" stroke-linecap="round"/><ellipse cx="50" cy="166" rx="19" ry="11" fill="#a473fc" stroke="#5e2ba9" stroke-width="4"/><ellipse cx="110" cy="166" rx="19" ry="11" fill="#a473fc" stroke="#5e2ba9" stroke-width="4"/>'+
  '<polygon points="82,12 103,54 149,60 116,92 125,139 82,115 40,139 48,92 15,60 61,54" fill="#b256fa" stroke="#5927a3" stroke-width="7" stroke-linejoin="round" transform="translate(0 4)"/>'+
  '<polygon points="82,18 101,57 141,63 111,93 120,132 82,110 45,132 52,93 23,63 63,57" fill="#ffe155" stroke="#ff9d36" stroke-width="5" stroke-linejoin="round"/>'+
  '<g fill="#2f1c59">'+eye+'</g>'+smile+'</svg>';
 }
 const boySmile=wide?'<ellipse cx="85" cy="105" rx="7" ry="10" fill="#642839"/>':mood==="think"?'<path d="M77 104l15-3" stroke="#7b3c43" stroke-width="3" stroke-linecap="round"/>':happy?'<path d="M73 100q13 22 27 0" fill="#c93751" stroke="#7d3944" stroke-width="3"/>':'<path d="M76 103q9 10 21 0" stroke="#7d3944" stroke-width="3" fill="none"/>';
 return '<svg viewBox="0 0 164 184" role="img" aria-label="Кібер">'+
 '<g class="mascot-arm-left"><path d="M54 132L30 146" stroke="#1566cc" stroke-width="19" stroke-linecap="round"/><circle cx="27" cy="149" r="10" fill="#ecc198"/></g>'+
 '<g class="mascot-arm-right"><path d="M109 132L138 '+(happy?'108':'143')+'" stroke="#1566cc" stroke-width="19" stroke-linecap="round"/><circle cx="138" cy="'+(happy?'105':'145')+'" r="10" fill="#ecc198"/></g>'+
 '<path d="M61 153L56 172M102 153L109 172" stroke="#244c94" stroke-width="15" stroke-linecap="round"/>'+
 '<path d="M43 115Q82 95 122 115L135 175H29Z" fill="#0c65d6" stroke="#073c8d" stroke-width="5"/><path d="M67 121L82 139L95 121" fill="none" stroke="#a9eaff" stroke-width="5"/>'+
 '<ellipse cx="83" cy="78" rx="39" ry="45" fill="#f2bb8a" stroke="#ad7456" stroke-width="3"/>'+
 '<path d="M44 76Q29 34 61 27Q69 8 90 28Q129 22 123 70Q103 43 95 40Q73 60 60 51Z" fill="#784121" stroke="#432316" stroke-width="5"/>'+
 '<path d="M46 63Q35 56 38 87" stroke="#2095f2" stroke-width="13" stroke-linecap="round"/><path d="M117 62Q128 56 125 87" stroke="#2095f2" stroke-width="13" stroke-linecap="round"/><circle cx="39" cy="82" r="12" fill="#26bafa" stroke="#0b4e9e" stroke-width="5"/><circle cx="125" cy="82" r="12" fill="#26bafa" stroke="#0b4e9e" stroke-width="5"/>'+
 '<g fill="#1864b1"><ellipse cx="69" cy="82" rx="'+(wide?8:6)+'" ry="'+(wide?10:7)+'"/><ellipse cx="100" cy="82" rx="'+(wide?8:6)+'" ry="'+(wide?10:7)+'"/></g>'+boySmile+'</svg>';
}

let serial=0;
window.CyfroWorkshopCharacter=(kind,mood)=>mascotArt(kind,mood).replaceAll("baytMetal","workshopMetal"+(++serial));
})();
