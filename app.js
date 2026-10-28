(function(){
  var WA='573189486875';
  function money(v){return '$'+Math.round(v).toLocaleString('es-CO')}
  // Origen del chat: cada red enlaza con ?o=ig, ?o=fb o ?o=tt y se recuerda mientras dure la visita
  var REDES={ig:'Instagram',fb:'Facebook',tt:'TikTok'},ori='';
  try{var po=new URLSearchParams(location.search).get('o');if(REDES[po])sessionStorage.setItem('inexo_o',po);ori=REDES[sessionStorage.getItem('inexo_o')]||''}catch(e){}
  var vengo=ori?'Vengo de '+ori+'.\n\n':'';
  if(ori) document.querySelectorAll('a[href^="https://wa.me/"]:not([data-wa])').forEach(function(a){
    a.href='https://wa.me/'+WA+'?text='+encodeURIComponent('Hola i-Nexo. '+vengo.trim());
  });
  // El botón de WhatsApp comparte la dirección real desde la que se abrió la página
  document.querySelectorAll('a[data-wa]').forEach(function(a){
    var d=a.getAttribute('data-wa').split('|');
    var msg='Hola i-Nexo.\n\n'+vengo+'Estoy interesado/a en este reloj, ¿está disponible?\n\nProducto: '+d[0]+'\nPrecio: '+d[1]+' COP\nLink: '+location.origin+location.pathname;
    a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  });
  var lista=document.getElementById('lista'); if(!lista) return;
  var q=document.getElementById('q'),c=document.getElementById('c'),o=document.getElementById('o'),n=document.getElementById('n'),mas=document.getElementById('mas');
  var todos=[],vistos=[],pag=0,POR=24;
  var p=new URLSearchParams(location.search); c.value=p.get('c')||''; q.value=p.get('q')||'';
  function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function card(x){
    var off=x.a>x.p?'<span class="off">-'+Math.round(100-x.p*100/x.a)+'%</span>':'';
    var antes=x.a>x.p?'<s>'+money(x.a)+'</s>':'';
    return '<a class="card" href="p/'+x.h+'.html"><div class="ph"><img loading="lazy" src="img/p/'+x.i+'" alt="">'+off+'</div><div class="ct"><span class="mk"></span><span class="tt"></span><span class="pr">'+money(x.p)+' '+antes+'</span></div></a>';
  }
  function pinta(){
    var html=vistos.slice(0,(pag+1)*POR).map(card).join('');lista.innerHTML=html;
    lista.querySelectorAll('.card').forEach(function(el,i){var x=vistos[i];el.querySelector('.mk').textContent=x.m;el.querySelector('.tt').textContent=x.t;el.querySelector('img').alt=x.t});
    mas.hidden=vistos.length<=(pag+1)*POR;
    n.textContent=vistos.length+(vistos.length===1?' reloj':' relojes');
  }
  function filtra(){
    var t=norm(q.value);
    vistos=todos.filter(function(x){return (!c.value||x.c.indexOf(c.value)>=0)&&(!t||norm(x.t+' '+x.m).indexOf(t)>=0)});
    if(o.value==='asc')vistos.sort(function(a,b){return a.p-b.p});
    if(o.value==='desc')vistos.sort(function(a,b){return b.p-a.p});
    pag=0;pinta();
    var u=new URLSearchParams();if(c.value)u.set('c',c.value);if(q.value)u.set('q',q.value);
    history.replaceState(null,'',location.pathname+(u.toString()?'?'+u:''));
  }
  q.addEventListener('input',filtra);
  document.getElementById('fb').addEventListener('submit',function(e){e.preventDefault();filtra();q.blur();lista.scrollIntoView({behavior:'smooth'})});c.addEventListener('change',filtra);o.addEventListener('change',filtra);
  mas.addEventListener('click',function(){pag++;pinta()});
  fetch('productos.json').then(function(r){return r.json()}).then(function(d){todos=d;filtra()});
})();
