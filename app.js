(function(){'use strict';
var D=window.CONTENTS||[],state={area:'전체',ready:'all',q:''};
var READY={all:'전체 상태',ready:'바로 가능',partial:'보강 필요',new:'교안 제작'};
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var hl=function(s){s=esc(s);if(!state.q)return s;var q=esc(state.q).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return s.replace(new RegExp(q,'gi'),function(m){return'<mark>'+m+'</mark>'})};
var sum=function(a){return a.reduce(function(t,x){return t+x.n},0)};
var cnt=function(k,v){return D.filter(function(x){return x[k]===v}).length};
$('hero-count').textContent=D.length+'개';
$('stats').innerHTML=[['전체 콘텐츠',D.length,'개',''],['총 차시',sum(D),'차시',''],['바로 가능',cnt('ready','ready'),'개','g'],['보강·제작 필요',D.length-cnt('ready','ready'),'개','o']].map(function(s){return'<div class="stat '+s[3]+'"><small>'+s[0]+'</small><strong>'+s[1]+'<i>'+s[2]+'</i></strong></div>'}).join('');
var areas=['전체'].concat(D.map(function(x){return x.area}).filter(function(v,i,a){return a.indexOf(v)===i}));
function chips(){
 $('area-chips').innerHTML=areas.map(function(a){var n=a==='전체'?D.length:cnt('area',a);return'<button class="chip" type="button" data-area="'+esc(a)+'" aria-pressed="'+(state.area===a)+'">'+esc(a)+'<b>'+n+'</b></button>'}).join('');
 $('ready-chips').innerHTML=Object.keys(READY).map(function(k){var n=k==='all'?D.length:cnt('ready',k);return'<button class="chip" type="button" data-ready="'+k+'" aria-pressed="'+(state.ready===k)+'">'+READY[k]+'<b>'+n+'</b></button>'}).join('');
}
function render(){
 var q=state.q.toLowerCase();
 var rows=D.filter(function(x){return(state.area==='전체'||x.area===state.area)&&(state.ready==='all'||x.ready===state.ready)&&(!q||(x.title+' '+x.out+' '+x.src+' '+x.area).toLowerCase().indexOf(q)>-1)});
 $('list').innerHTML=rows.map(function(x){var dots='';for(var i=0;i<x.n;i++)dots+='<i></i>';return'<article class="card"><div class="card-top"><span class="area">'+esc(x.area)+'</span><span class="badge '+x.ready+'">'+READY[x.ready]+'</span></div><h3>'+hl(x.title)+'</h3><div class="hours"><span class="dots" aria-hidden="true">'+dots+'</span>'+x.n+'차시 · '+(x.n*50)+'분 수업</div><p class="out"><span>끝나면 남는 것</span>'+hl(x.out)+'</p><p class="src">근거 · '+hl(x.src)+'</p></article>'}).join('');
 $('empty').hidden=rows.length>0;
 $('result').textContent=rows.length+'개 콘텐츠 · '+sum(rows)+'차시';
 chips();
}
document.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;if(b.dataset.area)state.area=b.dataset.area;if(b.dataset.ready)state.ready=b.dataset.ready;render()});
$('q').addEventListener('input',function(e){state.q=e.target.value.trim();render()});
render();
})();

