(function(){'use strict';
var D=window.CONTENTS||[];
var LV=['입문','초급','중급','고급'],LVC={'입문':'lv1','초급':'lv2','중급':'lv3','고급':'lv4'};
var AUD=['전체','학생','일반인','시니어'];
var READY={all:'전체 상태',ready:'바로 가능',partial:'보강 필요',new:'교안 제작'};
var p=new URLSearchParams(location.search);
var state={aud:AUD.indexOf(p.get('aud'))>-1?p.get('aud'):'전체',level:LV.indexOf(p.get('level'))>-1?p.get('level'):'전체',area:'전체',ready:'all',q:''};
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var hl=function(s){s=esc(s);if(!state.q)return s;var q=esc(state.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return s.replace(new RegExp(q,'gi'),function(m){return'<mark>'+m+'</mark>'})};
var sum=function(a){return a.reduce(function(t,x){return t+x.n},0)};
function match(x,skip){var q=state.q.toLowerCase();
 return(skip==='aud'||state.aud==='전체'||x.aud.indexOf(state.aud)>-1)&&(skip==='level'||state.level==='전체'||x.level===state.level)&&(skip==='area'||state.area==='전체'||x.area===state.area)&&(skip==='ready'||state.ready==='all'||x.ready===state.ready)&&(!q||(x.title+' '+x.out+' '+x.src+' '+x.area+' '+x.level+' '+x.aud.join(' ')).toLowerCase().indexOf(q)>-1)}
var cntBy=function(skip,f){return D.filter(function(x){return match(x,skip)&&f(x)}).length};
var areas=['전체'].concat(D.map(function(x){return x.area}).filter(function(v,i,a){return a.indexOf(v)===i}));
function tabs(){
 $('aud-tabs').innerHTML=AUD.map(function(a){return'<button type="button" role="tab" data-aud="'+a+'" aria-selected="'+(state.aud===a)+'">'+a+'<b>'+cntBy('aud',function(x){return a==='전체'||x.aud.indexOf(a)>-1})+'</b></button>'}).join('');
 $('level-tabs').innerHTML=['전체'].concat(LV).map(function(l){var n=cntBy('level',function(x){return l==='전체'||x.level===l});return'<button type="button" data-level="'+l+'" aria-pressed="'+(state.level===l)+'"'+(n?'':' class="zero"')+'>'+l+'<b>'+n+'개</b></button>'}).join('');
 $('area-chips').innerHTML=areas.map(function(a){return'<button class="chip" type="button" data-area="'+esc(a)+'" aria-pressed="'+(state.area===a)+'">'+esc(a)+'<b>'+cntBy('area',function(x){return a==='전체'||x.area===a})+'</b></button>'}).join('');
 $('ready-chips').innerHTML=Object.keys(READY).map(function(k){return'<button class="chip" type="button" data-ready="'+k+'" aria-pressed="'+(state.ready===k)+'">'+READY[k]+'<b>'+cntBy('ready',function(x){return k==='all'||x.ready===k})+'</b></button>'}).join('');
 var extra=(state.area!=='전체'?1:0)+(state.ready!=='all'?1:0);$('more-count').textContent=extra?'· '+extra+'개 적용 중':'';
}
function render(){
 var rows=D.filter(function(x){return match(x)}).sort(function(a,b){return LV.indexOf(a.level)-LV.indexOf(b.level)});
 $('list').innerHTML=rows.map(function(x){var dots='';for(var i=0;i<x.n;i++)dots+='<i></i>';return'<article class="card"><div class="card-top"><span class="area">'+esc(x.area)+'</span><span class="badges"><span class="badge lvb '+LVC[x.level]+'">'+x.level+'</span><span class="badge '+x.ready+'">'+READY[x.ready]+'</span></span></div><h3>'+hl(x.title)+'</h3><div class="tags">'+x.aud.map(function(a){return'<span class="tag">'+a+'</span>'}).join('')+'</div><div class="hours"><span class="dots" aria-hidden="true">'+dots+'</span>'+x.n+'차시 · '+(x.n*50)+'분 수업</div><p class="out"><span>끝나면 남는 것</span>'+hl(x.out)+'</p><p class="src">근거 · '+hl(x.src)+'</p></article>'}).join('');
 $('empty').hidden=rows.length>0;
 var label=[state.aud!=='전체'?state.aud:'',state.level!=='전체'?state.level:''].filter(Boolean).join(' · ');
 $('result').textContent=(label?label+' · ':'')+rows.length+'개 콘텐츠 · '+sum(rows)+'차시';
 tabs();
 var u=new URL(location.href);['aud','level'].forEach(function(k){if(state[k]==='전체')u.searchParams.delete(k);else u.searchParams.set(k,state[k])});history.replaceState(null,'',u.pathname+u.search);
}
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset;if(d.aud)state.aud=d.aud;else if(d.level)state.level=d.level;else if(d.area)state.area=d.area;else if(d.ready)state.ready=d.ready;else return;render()});
$('q').addEventListener('input',function(e){state.q=e.target.value.trim();render()});
$('hero-count').textContent=D.length+'개';
var rc=D.filter(function(x){return x.ready==='ready'}).length;
$('stats').innerHTML=[['전체 콘텐츠',D.length,'개',''],['총 차시',sum(D),'차시',''],['바로 가능',rc,'개','g'],['보강·제작 필요',D.length-rc,'개','o']].map(function(s){return'<div class="stat '+s[3]+'"><small>'+s[0]+'</small><strong>'+s[1]+'<i>'+s[2]+'</i></strong></div>'}).join('');
render();
})();

