function e({node:e,cb:t,cbOnce:o}){if(o(e),function(e){const t=e.getBoundingClientRect(),o=window.innerHeight||document.documentElement.clientHeight,c=window.innerWidth||document.documentElement.clientWidth;return t.top>=0&&t.left>=0&&t.bottom<=o&&t.right<=c}(e))return void t(e);new IntersectionObserver(((o,c)=>{o.forEach((o=>{o.isIntersecting&&(t(e),c.disconnect())}))})).observe(e)}function t({node:t,direction:o=null,cb:c=(()=>{}),cbOnce:n=(()=>{}),duration:a=1}){const r={},s=200,i=null===o;if(!Element.prototype.isPrototypeOf(t))throw new Error("node не является узлом DOM");"left"===o?r.x=-200:"right"===o?r.x=s:"top"===o?r.y=-200:"bottom"===o&&(r.y=s),e({node:t,cbOnce:()=>{n(),!0!==i&&gsap.set(t,{opacity:0,...r})},cb:()=>{c(t),!0!==i&&gsap.to(t,{opacity:1,y:0,x:0,duration:a})}})}const o=document.querySelector(".intro__title"),c=document.querySelector(".intro__description"),n=document.querySelector(".intro__btn"),a=document.querySelector(".intro__right-img"),r=document.querySelectorAll(".teams__slider-item"),s=document.querySelector(".teams__slider"),i=document.querySelectorAll(".header__nav-link, .header__btn-sign-in, .header__btn-started"),l=document.querySelector(".header"),d=document.querySelector(".intro__companies"),p=document.querySelectorAll(".intro__companies-text, .intro__companies-img-wrapper"),u=document.querySelector(".deals__section-header"),y=document.querySelectorAll(".deals__section-header > *"),_=document.querySelector(".deals__two"),g=document.querySelectorAll(".deals__two > *"),m=document.querySelector(".vendors__section-header"),b=document.querySelectorAll(".vendors__section-header > *"),S=document.querySelector(".vendors__two"),h=document.querySelectorAll(".vendors__two > *"),q=document.querySelector(".teams__section-header"),f=document.querySelector(".security__section-header"),w=document.querySelectorAll(".security__section-header > *"),O=document.querySelector(".footer"),v=document.querySelectorAll(".footer__logo, .footer__column > *");(()=>{for(let e=0;e<r.length;e++)e%2==0?r[e].classList.add("teams__slider-item_odd"):r[e].classList.add("teams__slider-item_even")})(),new Swiper(s,{slidesPerView:"auto",spaceBetween:30,loop:!0,roundLengths:!0,centeredSlides:!0,navigation:{nextEl:".teams__slider__arrow_right",prevEl:".teams__slider__arrow_left"}}),function(){gsap.defaults({duration:1,ease:"ease"});const e=gsap.timeline();e.add(gsap.set(a,{scale:1.2})),e.fromTo(a,{y:"40%"},{opacity:1,y:0}),e.to(a,{scale:1}),e.pause();const r=gsap.timeline().from(o,{opacity:0,x:"40%"}).from(c,{opacity:0,x:"-40%"}).from(n,{opacity:0,scale:1.5}).add(e.play());r.pause(),t({node:o,cb:()=>{r.play()}}),t({node:s,cbOnce:()=>{gsap.set(s,{opacity:0,x:-400})},cb:()=>{gsap.to(s,{opacity:1,x:0,delay:.5})}}),t({node:l,cbOnce:()=>{gsap.set(i,{opacity:0})},cb:()=>{gsap.to(i,{opacity:1,stagger:.3})}}),t({node:d,cbOnce:()=>{gsap.set(p,{opacity:0})},cb:()=>{gsap.to(p,{opacity:1,stagger:.5,delay:.5})}}),t({node:u,cbOnce:()=>{gsap.set(y,{opacity:0,scale:e=>e%2==0?2:0})},cb:()=>{gsap.to(y,{opacity:1,scale:1,stagger:.5,delay:.5})}}),t({node:_,cbOnce:()=>{gsap.set(g,{opacity:0,scale:0})},cb:()=>{gsap.to(g,{stagger:1,delay:.5,opacity:1,scale:1})}}),t({node:m,cbOnce:()=>{gsap.set(b,{opacity:0,scale:e=>e%2==0?2:0})},cb:()=>{gsap.to(b,{opacity:1,scale:1,stagger:.5,delay:.5})}}),t({node:S,cbOnce:()=>{gsap.set(h,{opacity:0,scale:0})},cb:()=>{gsap.to(h,{stagger:1,delay:.5,opacity:1,scale:1})}}),t({node:q,cbOnce:()=>{gsap.set(q,{opacity:0,scale:2})},cb:()=>{gsap.to(q,{scale:1,opacity:1})}}),t({node:f,cbOnce:()=>{gsap.set(w,{opacity:0,scale:e=>e%2==0?2:0})},cb:()=>{gsap.to(w,{opacity:1,scale:1,stagger:.5,delay:.5})}}),t({node:O,cbOnce:()=>{gsap.set(v,{opacity:0})},cb:()=>{gsap.to(v,{stagger:.15,delay:.5,opacity:1})}})}();
//# sourceMappingURL=index.ee897327.js.map