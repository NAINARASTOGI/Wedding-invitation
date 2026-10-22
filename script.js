
const preloader = document.getElementById('preloader');
window.addEventListener('load',()=>setTimeout(()=>preloader.classList.add('hide'),550));

const audio=document.getElementById('audio'), music=document.getElementById('musicBtn');
audio.loop = true;
let userPaused = false;
function startAudio(){
  audio.play().then(()=>music.classList.add('playing')).catch(()=>{});
}
music.addEventListener('click',()=>{
  if(audio.paused){userPaused=false;startAudio();}
  else{userPaused=true;audio.pause();music.classList.remove('playing');}
});

const petals=document.getElementById('petals');
for(let i=0;i<16;i++){
  const s=document.createElement('span');
  s.className='petal';
  s.textContent=['✿','❀','·','✧'][i%4];
  s.style.left=Math.random()*100+'%';
  s.style.fontSize=(10+Math.random()*17)+'px';
  s.style.animationDuration=(14+Math.random()*18)+'s';
  s.style.animationDelay=(-Math.random()*20)+'s';
  petals.appendChild(s);
}

const sections=[...document.querySelectorAll('main > section')];
const dots=document.getElementById('dots');
sections.forEach((sec,i)=>{
  const b=document.createElement('button');
  b.title=sec.classList.contains('events')?'Events':`Section ${i+1}`;
  b.onclick=()=>sec.scrollIntoView({behavior:'smooth'});
  dots.appendChild(b);
});
const dotBtns=[...dots.children];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const i=sections.indexOf(e.target);
      dotBtns.forEach((b,n)=>b.classList.toggle('active',n===i));
    }
  });
},{threshold:.45});
sections.forEach(s=>observer.observe(s));

document.querySelectorAll('.event-card').forEach(card=>{
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){card.style.transform='translateY(0)';card.style.opacity='1';}});
  },{threshold:.15});
  card.style.transform='translateY(35px)';
  card.style.opacity='0';
  card.style.transition='opacity .8s ease, transform .9s cubic-bezier(.2,.7,.2,1)';
  io.observe(card);
});

/* ── Envelope Entry Screen ─────────────────────────────────────── */
const envScreen  = document.getElementById('env-screen');
const envelopeBox = document.getElementById('envelopeBox');
const envCta     = document.getElementById('envCta');

function openEnvelope(){
  envelopeBox.classList.add('open');
  envCta.style.opacity = '0';
  envCta.style.pointerEvents = 'none';
  userPaused=false;
  startAudio();
  setTimeout(()=>{
    envScreen.classList.add('hidden');
    window.scrollTo(0,0);
  }, 900);
}

envelopeBox.addEventListener('click', openEnvelope);
envCta.addEventListener('click', openEnvelope);
// Start music at the very first touch of the envelope (most reliable moment to unlock audio)
[envelopeBox, envCta].forEach(el=>{
  el.addEventListener('pointerdown',()=>{userPaused=false;startAudio();},{passive:true});
});

/* ── Days-of-togetherness counter ─────────────────────────────── */
const weddingDate = new Date('2026-11-25T00:00:00');
const elDays      = document.getElementById('cDays');
const elHours     = document.getElementById('cHours');
const elMins      = document.getElementById('cMins');
const elSecs      = document.getElementById('cSecs');
const elLabel     = document.getElementById('counterLabel');
const elCaption   = document.getElementById('counterCaption');

function pad(n){ return String(n).padStart(2,'0'); }

function updateCounter(){
  const diff = Date.now() - weddingDate.getTime();
  const isPast = diff >= 0;
  const abs = Math.abs(diff);
  const totalSec = Math.floor(abs / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  elDays.textContent  = pad(d);
  elHours.textContent = pad(h);
  elMins.textContent  = pad(m);
  elSecs.textContent  = pad(s);

  if(isPast){
    elLabel.textContent   = 'DAYS OF TOGETHERNESS';
    elCaption.textContent = 'Since our wedding · November 25, 2026 · Bhagwati';
  } else {
    elLabel.textContent   = 'DAYS UNTIL OUR WEDDING';
    elCaption.textContent = 'November 25, 2026 · Bhagwati Garden Mawana';
  }
}
updateCounter();
setInterval(updateCounter, 1000);

/* ── Scroll-reveal for couple + counter sections ──────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealIO  = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('revealed'); });
},{threshold:.12});
revealEls.forEach(el=>revealIO.observe(el));

/* ── Dots nav: include couple + counter in section list ──────── */
// (re-run after DOM is settled; the existing observer already catches all main>section)
