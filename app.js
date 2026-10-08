const qs=(s,r=document)=>r.querySelector(s),qsa=(s,r=document)=>[...r.querySelectorAll(s)];

const modalData={
 freedom:{title:"Свобода",body:"<p>У Достоевского свобода почти никогда не означает просто возможность делать что угодно. Она связана с ответственностью за выбор и с опасностью превратить собственную волю в право переступать через другого.</p><p>Эта проблема проходит через Раскольникова, Ивана Карамазова, Великого инквизитора и многих других персонажей.</p>"},
 guilt:{title:"Вина",body:"<p>Вина у Достоевского может быть юридической, нравственной и внутренней — и эти уровни не совпадают. Человек способен формально избежать наказания и при этом продолжать жить внутри собственного приговора.</p>"},
 faith:{title:"Вера и сомнение",body:"<p>Его герои не просто «верят» или «не верят». Они спорят, сомневаются, требуют доказательств и сталкиваются со страданием. Поэтому религиозная проблематика у Достоевского почти всегда связана с драмой личного выбора.</p>"},
 other:{title:"Другой человек",body:"<p>Человек у Достоевского раскрывается в отношениях. Унижение, сострадание, любовь, ревность и власть показывают, насколько трудно увидеть в другом самостоятельную личность, а не инструмент для собственного счастья.</p>"},
 beauty:{title:"«Красота спасет мир»",body:"<p>Фраза произносится князем Мышкиным в «Идиоте». Вырывать её из романа и превращать в универсальный рекламный слоган слишком просто: Достоевский заставляет читателя спрашивать, что именно считать красотой и способна ли она существовать отдельно от нравственного выбора.</p>"}
};

function setupMenu(){
 const header=qs("[data-header]"),button=qs("[data-menu]"); if(!header||!button)return;
 button.addEventListener("click",()=>{const open=header.classList.toggle("menu-open");button.setAttribute("aria-expanded",String(open));});
 qsa(".nav a").forEach(a=>a.addEventListener("click",()=>header.classList.remove("menu-open")));
}
function setupReveal(){
 const items=qsa(".reveal"); if(!items.length)return;
 if(!("IntersectionObserver" in window)){items.forEach(x=>x.classList.add("visible"));return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");}),{threshold:.12});
 items.forEach(x=>observer.observe(x));
}
function setupHeader(){
 const header=qs("[data-header]");if(!header)return;
 const update=()=>header.classList.toggle("scrolled",window.scrollY>20);update();window.addEventListener("scroll",update,{passive:true});
}
function setupModal(){
 const modal=qs("[data-modal-root]");if(!modal)return;
 const title=qs("[data-modal-title]",modal),body=qs("[data-modal-body]",modal);
 const close=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");};
 const open=data=>{title.textContent=data.title;body.innerHTML=data.body;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");qs(".modal-close",modal)?.focus();};
 qsa("[data-modal]").forEach(b=>b.addEventListener("click",()=>{const data=modalData[b.dataset.modal];if(data)open(data);}));
 qsa("[data-modal-close]",modal).forEach(b=>b.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))close();});
}
const timelineData={
 1821:["Рождение в Москве","11 ноября 1821 года по новому стилю Фёдор Михайлович родился в Москве в семье штаб-лекаря Мариинской больницы для бедных Михаила Андреевича Достоевского и Марии Фёдоровны."],
 1846:["«Бедные люди»","В 1846 году опубликован первый роман Достоевского. Некрасов и Белинский обратили внимание на молодого автора ещё до выхода книги, и его имя быстро стало известно петербургским литературным кругам."],
 1849:["Арест и инсценировка казни","В апреле Достоевский был арестован по делу петрашевцев. В декабре на Семёновском плацу смертный приговор был отменён в момент, когда осуждённых уже привели к исполнению; затем последовали четыре года каторги в Омске."],
 1866:["«Преступление и наказание»","В 1866 году в «Русском вестнике» началась публикация романа. В тот же год Достоевский работал над «Игроком», а осенью познакомился со стенографисткой Анной Сниткиной."],
 1879:["«Братья Карамазовы»","Последний роман выходил в 1879–1880 годах. В нём соединяются семейная драма, вопросы веры, свободы, ответственности и проблемы человеческого зла."],
 1881:["Последняя глава","Достоевский умер 9 февраля 1881 года по новому стилю в Петербурге. 1 февраля по старому стилю состоялись похороны на Тихвинском кладбище Александро-Невской лавры."]
};
function setupTimeline(){
 const card=qs("[data-timeline-card]");if(!card)return;
 const render=year=>{const d=timelineData[year];if(!d)return;card.innerHTML=`<span class="year">${year}</span><h3>${d[0]}</h3><p>${d[1]}</p>`;qsa(".timeline-item").forEach(x=>{const active=x.dataset.year===String(year);x.classList.toggle("active",active);x.setAttribute("aria-selected",String(active));});};
 qsa(".timeline-item").forEach(b=>b.addEventListener("click",()=>render(b.dataset.year)));render(1821);
}
function setupFilters(){
 const buttons=qsa("[data-filter]");
 if(!buttons.length)return;
 const cards=qsa("[data-filter-item]");
 buttons.forEach(b=>b.addEventListener("click",()=>{
  buttons.forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  const filter=b.dataset.filter;
  cards.forEach(c=>c.hidden=filter!=="all"&&c.dataset.filterItem!==filter);
 }));
}
function setupQuiz(){
 const root=qs("[data-quiz]");if(!root)return;
 const questions=[
 ["В каком году родился Достоевский?",["1812","1821","1831","1841"],1],
 ["Какое произведение принесло ему первый большой литературный успех?",["«Идиот»","«Бесы»","«Бедные люди»","«Игрок»"],2],
 ["Сколько лет каторги он получил после отмены смертного приговора?",["2","4","6","8"],1],
 ["Какой роман стал последним?",["«Братья Карамазовы»","«Подросток»","«Бесы»","«Идиот»"],0],
 ["Где находится мемориальная квартира Достоевского в Петербурге?",["Невский проспект","Кузнечный переулок","Литейный проспект","Васильевский остров"],1]
 ];
 const q=qs("[data-question]",root),progress=qs("[data-progress]",root),next=qs("[data-next]",root),scoreEl=qs("[data-score]",root);
 let i=0,score=0,selected=null;
 const render=()=>{const item=questions[i];progress.style.width=`${((i+1)/questions.length)*100}%`;q.innerHTML=`<div class="quiz-question">${i+1}. ${item[0]}</div><div class="answers">${item[1].map((a,n)=>`<button class="answer" data-answer="${n}">${a}</button>`).join("")}</div>`;selected=null;next.disabled=true;qsa(".answer",root).forEach(b=>b.addEventListener("click",()=>{qsa(".answer",root).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=Number(b.dataset.answer);next.disabled=false;}));};
 next.addEventListener("click",()=>{if(i>=questions.length){i=0;score=0;next.textContent="Ответить";scoreEl.textContent="";render();return;}if(selected===null)return;if(selected===questions[i][2])score++;i++;if(i<questions.length){next.textContent=i===questions.length-1?"Завершить":"Ответить";render();}else{q.innerHTML=`<div class="quiz-question">Готово. Ваш результат — ${score} из ${questions.length}.</div><p>${score>=4?"Отличный результат. Теперь можно углубляться в тексты и контекст.":score>=2?"Хорошее начало. Пройдите хронологию ещё раз — часть ответов там.":"Достоевский явно просит второго свидания. Начните с биографии."}</p>`;next.textContent="Пройти ещё раз";next.disabled=false;scoreEl.textContent="";}});
 render();
}
document.addEventListener("DOMContentLoaded",()=>{setupMenu();setupHeader();setupReveal();setupModal();setupTimeline();setupFilters();setupQuiz();});
