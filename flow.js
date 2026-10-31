(function(){'use strict';
var D=window.CONTENTS||[];
var AUD=['학생','일반인','시니어'],LV=['입문','초급','중급','고급'],LVC={'입문':'lv1','초급':'lv2','중급':'lv3','고급':'lv4'};
var LVD={'입문':'설치·첫 사용','초급':'따라 하면 완성','중급':'내 주제로 응용','고급':'도구 연결·편집'};
var READY={ready:'바로 가능',partial:'보강 필요',new:'교안 제작'};
var AREA_C={'기초':'#4a7dff','도구 준비':'#7552e8','업무 자동화':'#ff6d5a','지식 관리':'#2db37a','만들기':'#f2a43a','콘텐츠·영상':'#e2558f','심화':'#20232a'};
var ICON={bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',bars:'<path d="M5 20v-5M10 20v-9M15 20V8M20 20V4"/>'};
var svg=function(k){return'<svg viewBox="0 0 24 24">'+ICON[k]+'</svg>'};
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var sum=function(a){return a.reduce(function(t,x){return t+x.n},0)};
var q=new URLSearchParams(location.search);
var st={aud:AUD.indexOf(q.get('aud'))>-1?q.get('aud'):null,level:LV.indexOf(q.get('level'))>-1?q.get('level'):null,item:q.get('item')};
if(!st.aud)st.level=null;
var byAud=function(a){return D.filter(function(x){return x.aud.indexOf(a)>-1})};
var items=function(){return st.aud&&st.level?byAud(st.aud).filter(function(x){return x.level===st.level}):[]};
var mobile=function(){return matchMedia('(max-width:760px)').matches};
function node(o){return'<button type="button" class="node '+(o.cls||'')+'" data-k="'+o.k+'" data-v="'+esc(o.v)+'"'+(o.pressed!=null?' aria-pressed="'+o.pressed+'"':'')+(o.dis?' disabled':'')+' aria-label="'+esc(o.label||o.title)+'">'+(o.noL?'':'<span class="hd l"></span>')+'<span class="ico"'+(o.icoStyle?' style="'+o.icoStyle+'"':'')+'>'+o.ico+'</span><span class="t"><strong>'+esc(o.title)+'</strong>'+(o.sub?'<small>'+esc(o.sub)+'</small>':'')+'</span>'+(o.cnt!=null?'<span class="cnt">'+o.cnt+'</span>':'')+(o.stc?'<span class="st '+o.stc+'"></span>':'')+(o.noR?'':'<span class="hd r"></span>')+'</button>'}
function render(){
 $('col-start').innerHTML='<h2>시작</h2>'+node({k:'start',v:'start',cls:'trigger'+(st.aud?' sel':''),noL:1,ico:svg('bolt'),title:'AI빌더스랩 교육',sub:D.length+'개 콘텐츠 · '+sum(D)+'차시'});
 $('col-aud').innerHTML='<h2>대상</h2>'+AUD.map(function(a){var r=byAud(a);return node({k:'aud',v:a,cls:'aud',pressed:st.aud===a,ico:svg('user'),title:a,sub:r.length+'개 · '+sum(r)+'차시',cnt:r.length,label:a+' '+r.length+'개 콘텐츠'})}).join('');
 var lc=$('col-level');lc.hidden=!st.aud;if(!st.aud)lc.innerHTML='';
 if(st.aud){var ba=byAud(st.aud);lc.innerHTML='<h2>'+esc(st.aud)+' · 수준</h2>'+LV.map(function(l){var n=ba.filter(function(x){return x.level===l}).length;return node({k:'level',v:l,cls:LVC[l],pressed:st.level===l,dis:!n,ico:svg('bars'),title:l,sub:LVD[l],cnt:n+'개',label:l+' '+n+'개'})}).join('');}
 var ic=$('col-items'),its=items();ic.hidden=!its.length;if(!its.length)ic.innerHTML='';
 if(its.length)ic.innerHTML='<h2>'+esc(st.aud+' · '+st.level)+' · '+its.length+'개 · '+sum(its)+'차시</h2>'+its.map(function(x){return node({k:'item',v:x.title,cls:'item'+(st.item===x.title?' sel':''),ico:esc(x.area.slice(0,1)),icoStyle:'background:'+(AREA_C[x.area]||'#20232a'),title:x.title,sub:x.area+' · '+x.n+'차시 · '+READY[x.ready],stc:x.ready})}).join('')+'<p class="legend"><span><i style="background:var(--g)"></i>바로 가능</span><span><i style="background:var(--y)"></i>보강 필요</span><span><i style="background:var(--gr)"></i>교안 제작</span></p>';
 $('crumb').textContent=['교육 콘텐츠 워크플로',st.aud,st.level].filter(Boolean).join(' › ');
 $('hint').textContent=!st.aud?'대상 노드를 눌러 보세요 · 1차시 = 수업 50분 + 휴식 10분':!st.level?'수준 노드를 눌러 보세요':'콘텐츠 노드를 누르면 상세가 열려요';
 var u=new URL(location.href);['aud','level','item'].forEach(function(k){if(st[k])u.searchParams.set(k,st[k]);else u.searchParams.delete(k)});history.replaceState(null,'',u.pathname+u.search);
 panel();requestAnimationFrame(edges);
}
function anchor(el,side,box){var r=el.getBoundingClientRect(),m=mobile();
 if(m)return{x:r.left+r.width/2-box.left,y:(side==='out'?r.bottom:r.top)-box.top};
 return{x:(side==='out'?r.right:r.left)-box.left,y:r.top+r.height/2-box.top}}
function curve(a,b,on){var m=mobile(),d;
 if(m){var dy=Math.max(24,(b.y-a.y)/2);d='M'+a.x+','+a.y+' C'+a.x+','+(a.y+dy)+' '+b.x+','+(b.y-dy)+' '+b.x+','+b.y}
 else{var dx=Math.max(30,(b.x-a.x)/2);d='M'+a.x+','+a.y+' C'+(a.x+dx)+','+a.y+' '+(b.x-dx)+','+b.y+' '+b.x+','+b.y}
 return'<path d="'+d+'"'+(on?' class="on"':'')+'/>'}
function edges(){var f=$('flow'),box=f.getBoundingClientRect(),s=$('edges'),out='';
 s.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
 var start=f.querySelector('[data-k=start]');
 f.querySelectorAll('[data-k=aud]').forEach(function(n){out+=curve(anchor(start,'out',box),anchor(n,'in',box),n.dataset.v===st.aud)});
 var sa=f.querySelector('[data-k=aud][aria-pressed=true]');
 if(sa)f.querySelectorAll('[data-k=level]:not([disabled])').forEach(function(n){out+=curve(anchor(sa,'out',box),anchor(n,'in',box),n.dataset.v===st.level)});
 var sl=f.querySelector('[data-k=level][aria-pressed=true]');
 if(sl){var its=f.querySelectorAll('[data-k=item]');
  if(mobile()&&its.length){out+=curve(anchor(sl,'out',box),anchor(its[0],'in',box),true);for(var i=1;i<its.length;i++)out+=curve(anchor(its[i-1],'out',box),anchor(its[i],'in',box),its[i].dataset.v===st.item)}
  else its.forEach(function(n){out+=curve(anchor(sl,'out',box),anchor(n,'in',box),n.dataset.v===st.item)})}
 s.innerHTML=out}
function panel(){var p=$('panel'),x=D.filter(function(d){return d.title===st.item})[0];
 if(!x||!st.level){p.classList.remove('open');p.setAttribute('aria-hidden','true');$('scrim').hidden=true;return}
 var blocks='';for(var i=0;i<x.n;i++)blocks+=(i?'<span class="rest">휴식</span>':'')+'<span>'+(i+1)+'차시 50분</span>';
 $('panel-in').innerHTML='<div class="p-top"><span class="p-area">'+esc(x.area)+'</span><button type="button" class="x" data-close aria-label="닫기">×</button></div><h3>'+esc(x.title)+'</h3><div class="pills"><span class="pill '+LVC[x.level]+'">'+x.level+'</span><span class="pill '+x.ready+'">'+READY[x.ready]+'</span>'+x.aud.map(function(a){return'<span class="pill">'+a+'</span>'}).join('')+'</div><dl class="kv"><div><dt>수업 시간</dt><dd>'+x.n+'차시 · 수업 '+(x.n*50)+'분</dd></div><div><dt>끝나면 남는 것</dt><dd>'+esc(x.out)+'</dd></div><div><dt>준비 상태</dt><dd>'+READY[x.ready]+'</dd></div><div><dt>근거 자료</dt><dd>'+esc(x.src)+'</dd></div></dl><div class="sched" aria-label="차시 구성">'+blocks+'</div><p class="p-note">1차시는 수업 50분과 휴식 10분이에요. 차시 수는 기존 교안 분량을 기준으로 추정했어요.</p>';
 p.classList.add('open');p.setAttribute('aria-hidden','false');$('scrim').hidden=!mobile()}
function reveal(id){var el=$(id);if(!el||el.hidden)return;setTimeout(function(){el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:mobile()?'start':'nearest',inline:'nearest'})},60)}
document.addEventListener('click',function(e){
 if(e.target.closest('[data-close]')||e.target.id==='scrim'){st.item=null;render();return}
 var n=e.target.closest('.node');if(!n||n.disabled)return;var k=n.dataset.k,v=n.dataset.v;
 if(k==='start'){st.aud=null;st.level=null;st.item=null;render();return}
 if(k==='aud'){if(st.aud===v){st.aud=null;st.level=null}else{st.aud=v;st.level=null}st.item=null;render();$('live').textContent=st.aud?st.aud+' 선택, 수준을 고르세요':'';reveal('col-level');return}
 if(k==='level'){st.level=st.level===v?null:v;st.item=null;render();$('live').textContent=st.level?st.level+' 콘텐츠 '+items().length+'개':'';reveal('col-items');return}
 if(k==='item'){st.item=st.item===v?null:v;render()}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&st.item){st.item=null;render()}});
$('reset').addEventListener('click',function(){st={aud:null,level:null,item:null};render();window.scrollTo(0,0);$('canvas').scrollTo(0,0)});
var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(function(){edges();panel()},80)});
$('canvas').addEventListener('scroll',function(){requestAnimationFrame(edges)},{passive:true});
document.fonts&&document.fonts.ready.then(edges);
render();
})();

