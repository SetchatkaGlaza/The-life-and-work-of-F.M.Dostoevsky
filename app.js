(()=>{"use strict";
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const header=q("[data-header]"); const progress=q("[data-progress]");
const onScroll=()=>{const y=scrollY;header?.classList.toggle("scrolled",y>30);if(progress){const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h?y/h*100:0)+"%"}};addEventListener("scroll",onScroll,{passive:true});onScroll();
const menu=q("[data-menu]");menu?.addEventListener("click",()=>{const open=header.classList.toggle("menu-open");menu.setAttribute("aria-expanded",String(open));});
qa(".nav a").forEach(a=>{if(a.href===location.href)a.classList.add("active")});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});qa(".reveal").forEach(e=>observer.observe(e));
const cursor=q("[data-cursor]");if(cursor&&matchMedia("(pointer:fine)").matches){addEventListener("pointermove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"})}
qa(".library-card").forEach((card,i)=>card.style.transitionDelay=Math.min(i%3*45,90)+"ms");
const filterButtons=qa("[data-filter]"),items=qa("[data-filter-item]"),count=q("[data-count]");
function filter(value){let n=0;items.forEach(item=>{const show=value==="all"||item.dataset.filterItem.split(" ").includes(value);item.hidden=!show;if(show)n++});if(count)count.textContent=n+" материалов";filterButtons.forEach(b=>b.classList.toggle("active",b.dataset.filter===value))}
if(filterButtons.length){filter("all");filterButtons.forEach(b=>b.addEventListener("click",()=>filter(b.dataset.filter)))}
})();