(function(){
'use strict';
/* GitHub Pages não permite cabeçalho anti-iframe: se o site estiver dentro de outra página, esconde o conteúdo */
try{if(window.top!==window.self)document.documentElement.classList.add('framed')}catch(e){document.documentElement.classList.add('framed')}
const NUM='5586981345061', TZ='America/Fortaleza';
const H=[['Domingo',null],['Segunda',[9,20]],['Terça',[9,20]],['Quarta',[9,20]],['Quinta',[9,20]],['Sexta',[9,20]],['Sábado',[9,18]]];
const $=id=>document.getElementById(id);
const wa=t=>'https://wa.me/'+NUM+(t?'?text='+encodeURIComponent(t):'');
$('wa').href=wa('Olá! Vim pelo site da Midaz Barbearia.');
$('yr').textContent=new Date().getFullYear();

/* Horário no fuso de Teresina */
function now(){const p=new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());const g=t=>p.find(x=>x.type===t).value;
return{d:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),m:(+g('hour')%24)*60+ +g('minute')}}
function status(){const n=now(),h=H[n.d][1],on=h&&n.m>=h[0]*60&&n.m<h[1]*60;
$('dot').className='dot'+(on?' on':'');
$('st').textContent=on?'Aberto agora · fecha às '+h[1]+'h':'Fechado agora';
const box=$('hrs');box.textContent='';
H.forEach((r,i)=>{const d=document.createElement('div');d.className='row'+(i===n.d?' today':'');
const a=document.createElement('span'),b=document.createElement('span');a.textContent=r[0];b.textContent=r[1]?r[1][0]+'h – '+r[1][1]+'h':'Fechado';d.append(a,b);box.append(d)})}
status();setInterval(status,60000);

/* Header e menu */
const hd=$('hd'),mn=$('mn'),bg=$('bg');
addEventListener('scroll',()=>hd.classList.toggle('s',scrollY>30),{passive:true});
function menu(o){mn.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);bg.textContent=o?'✕':'☰';document.body.classList.toggle('lock',o)}
bg.onclick=()=>menu(!mn.classList.contains('open'));
mn.querySelectorAll('a').forEach(a=>a.onclick=()=>menu(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
document.addEventListener('click',e=>{if(mn.classList.contains('open')&&!hd.contains(e.target))menu(false)});
addEventListener('resize',()=>{if(innerWidth>860)menu(false)});

/* Animações ao rolar */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
document.querySelectorAll('[data-n]').forEach(el=>{const t=+el.dataset.n,dc=+el.dataset.d||0;let s=null;
(function f(ts){s=s||ts;const p=Math.min((ts-s)/1400,1);el.textContent=(t*(1-Math.pow(1-p,3))).toFixed(dc);if(p<1)requestAnimationFrame(f)})(performance.now())});

/* Efeito 3D nos cards */
if(matchMedia('(hover:hover)').matches)document.querySelectorAll('.tilt').forEach(c=>{
c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(700px) rotateY('+x*8+'deg) rotateX('+-y*8+'deg) translateY(-4px)'});
c.addEventListener('mouseleave',()=>c.style.transform='')});

/* Formulário */
const dt=$('dt'),tm=$('tm');
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=new Date();dt.min=iso(today);
const mx=new Date();mx.setDate(mx.getDate()+60);dt.max=iso(mx);
function slots(){tm.textContent='';const v=dt.value;if(!/^\d{4}-\d{2}-\d{2}$/.test(v)){tm.add(new Option('Escolha a data primeiro',''));return}
const d=new Date(v+'T12:00:00'),h=H[d.getDay()][1];
if(!h){tm.add(new Option('Fechado neste dia',''));return}
tm.add(new Option('Selecione',''));
const n=now(),isToday=v===iso(today);
for(let m=h[0]*60;m<=h[1]*60-30;m+=30){if(isToday&&m<=n.m+30)continue;tm.add(new Option(String(Math.floor(m/60)).padStart(2,'0')+':'+(m%60?'30':'00'),String(m)))}}
dt.onchange=slots;slots();

$('ph').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,11);
if(v.length>6)v='('+v.slice(0,2)+') '+v.slice(2,v.length>10?7:6)+'-'+v.slice(v.length>10?7:6);else if(v.length>2)v='('+v.slice(0,2)+') '+v.slice(2);e.target.value=v});

/* Limite de envios (anti-spam simples no cliente) */
function limited(){try{const k='mz_t',a=JSON.parse(localStorage.getItem(k)||'[]').filter(t=>Date.now()-t<6e5);
if(a.length>=3)return true;a.push(Date.now());localStorage.setItem(k,JSON.stringify(a));return false}catch(e){return false}}
const clean=s=>s.normalize('NFC').replace(/[^\p{L}\s'\-]/gu,'').replace(/\s+/g,' ').trim();

$('f').addEventListener('submit',e=>{e.preventDefault();
['e1','e2','e3','e4'].forEach(i=>$(i).textContent='');const msg=$('msg');msg.textContent='';
if($('hp').value)return; /* honeypot: bots preenchem */
let ok=true;const nome=clean($('nm').value),tel=$('ph').value.replace(/\D/g,'');
if(nome.length<2){$('e1').textContent='Informe seu nome.';ok=false}
if(!/^[1-9]{2}9?\d{8}$/.test(tel)){$('e2').textContent='Telefone inválido.';ok=false}
if(!dt.value||!H[new Date(dt.value+'T12:00:00').getDay()][1]){$('e3').textContent='Escolha uma data em que abrimos.';ok=false}
if(!tm.value){$('e4').textContent='Escolha um horário.';ok=false}
const sv=$('sv').value;if(!['Corte de cabelo','Barba','Combo corte + barba','Sobrancelha e acabamento'].includes(sv))ok=false;
if(!ok)return;
if(limited()){msg.style.color='#ff7b7b';msg.textContent='Muitas tentativas. Aguarde alguns minutos.';return}
const hh=+tm.value,hora=String(Math.floor(hh/60)).padStart(2,'0')+':'+(hh%60?'30':'00');
const [y,m,d]=dt.value.split('-');
const txt='Olá! Gostaria de agendar:\n• Nome: '+nome+'\n• Serviço: '+sv+'\n• Data: '+d+'/'+m+'/'+y+'\n• Horário: '+hora+'\n• Contato: '+$('ph').value;
msg.style.color='#3ddc84';msg.textContent='Abrindo o WhatsApp…';
window.open(wa(txt),'_blank','noopener,noreferrer');$('f').reset();slots()});
})();
