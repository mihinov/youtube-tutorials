function e({node:e,cbOnce:t=()=>{},cb:o=()=>{}}){if(t(e),!0===function(e){let t=e.getBoundingClientRect(),o=window.innerHeight||document.documentElement.clientHeight,c=window.innerWidth||document.documentElement.clientWidth;return t.top>=0&&t.left>=0&&t.bottom<=o&&t.right<=c}(e)){o(e);return}!function(e,t){new IntersectionObserver((o,c)=>{o.forEach(o=>{o.isIntersecting&&(t(e),c.disconnect())})}).observe(e)}(e,o)}const t=document.querySelector(".teams__slider"),o=document.querySelectorAll(".teams__slider-item"),c=document.querySelectorAll(".header .link"),a=document.querySelector(".header"),n=document.querySelector(".intro__title"),r=document.querySelector(".intro__description"),s=document.querySelector(".intro__link"),l=document.querySelector(".intro__img"),i=document.querySelector(".intro__left-and-right"),d=document.querySelector(".intro__companies"),u=document.querySelectorAll(".intro__companies-text, .intro__companies-img"),y=document.querySelector(".deals__section-header"),p=document.querySelectorAll(".deals__section-header > *"),_=document.querySelector(".deals__two"),g=document.querySelectorAll(".deals__two-left, .deals__two-right"),m=document.querySelector(".vendor__section-header"),b=document.querySelectorAll(".vendor__section-header > *"),S=document.querySelector(".vendor__two"),q=document.querySelectorAll(".vendor__two-left, .vendor__two-right"),h=document.querySelector(".teams__title"),w=document.querySelector(".security"),f=document.querySelector(".security__section-header"),O=document.querySelectorAll(".security__section-header > *"),v=document.querySelector(".security__img"),x=document.querySelector(".footer"),A=document.querySelectorAll(".footer__logo, .footer__column-item");(()=>{for(let e=0;e<o.length;e++)(e+1)%2==1?o[e].classList.add("teams__slider-item_odd"):o[e].classList.add("teams__slider-item_even")})(),new Swiper(t,{slidesPerView:"auto",spaceBetween:30,loop:!0,roundLengths:!0,centeredSlides:!0,navigation:{nextEl:".teams__slider-arrow_right",prevEl:".teams__slider-arrow_left"}}),gsap.defaults({duration:1,ease:"ease"}),e({node:a,cbOnce:()=>{gsap.set(c,{opacity:0})},cb:()=>{gsap.to(c,{opacity:1,stagger:.3})}}),e({node:i,cbOnce:()=>{gsap.set(n,{x:"40%",opacity:0}),gsap.set(r,{x:"-40%",opacity:0}),gsap.set(s,{scale:1.5,opacity:0}),gsap.set(l,{scale:1.2,opacity:0,y:"60%"})},cb:()=>{gsap.timeline().to(n,{x:0,opacity:1}).to(r,{x:0,opacity:1}).to(s,{scale:1,opacity:1}).to(l,{y:0,opacity:1}).to(l,{scale:1})}}),e({node:d,cbOnce:()=>{gsap.set(u,{opacity:0})},cb:()=>{gsap.to(u,{opacity:1,stagger:.5,delay:.5})}}),e({node:y,cbOnce:()=>{gsap.set(p,{opacity:0,scale:e=>e%2==0?2:0})},cb:()=>{gsap.to(p,{opacity:1,scale:1,stagger:.5,delay:.5})}}),e({node:_,cbOnce:()=>{gsap.set(g,{opacity:0,scale:0})},cb:()=>{gsap.to(g,{opacity:1,scale:1,stagger:.5,delay:.5})}}),e({node:m,cbOnce:()=>{gsap.set(b,{opacity:0,scale:e=>e%2==0?2:0})},cb:()=>{gsap.to(b,{opacity:1,scale:1,stagger:.5,delay:.5})}}),e({node:S,cbOnce:()=>{gsap.set(q,{opacity:0,scale:0})},cb:()=>{gsap.to(q,{opacity:1,scale:1,stagger:.5,delay:.5})}}),e({node:h,cbOnce:()=>{gsap.set(h,{opacity:0,scale:1.5})},cb:()=>{gsap.to(h,{opacity:1,scale:1})}}),e({node:t,cbOnce:()=>{gsap.set(t,{opacity:0,x:"-40%"})},cb:()=>{gsap.to(t,{opacity:1,x:0,delay:.5})}}),e({node:f,cbOnce:()=>{gsap.set(O,{opacity:0,scale:e=>e%2==1?2:0})},cb:()=>{gsap.to(O,{opacity:1,scale:1,stagger:.5,delay:.5})}}),e({node:w,cbOnce:()=>{gsap.set(v,{opacity:0,x:"500%"})},cb:()=>{gsap.to(v,{opacity:1,x:0})}}),e({node:x,cbOnce:()=>{gsap.set(A,{opacity:0})},cb:()=>{gsap.to(A,{opacity:1,stagger:.3,delay:.5})}});
//# sourceMappingURL=index.d5ff4f8d.js.map