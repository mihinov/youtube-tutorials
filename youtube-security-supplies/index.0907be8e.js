var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},i={},s=e.parcelRequiree4b2;null==s&&((s=function(e){if(e in t)return t[e].exports;if(e in i){var s=i[e];delete i[e];var r={id:e,exports:{}};return t[e]=r,s.call(r.exports,r,r.exports),r.exports}var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){i[e]=t},e.parcelRequiree4b2=s),s.register("U28IF",(function(e,t){var i,s,r,o;i=e.exports,s="Slider",r=()=>n,Object.defineProperty(i,s,{get:r,set:o,enumerable:!0,configurable:!0});class n{#e={sliderNode:null,sliderItemsNode:null,sliderItemNodes:[],sliderArrowLeftNode:null,sliderArrowRightNode:null,sliderWrapperNode:null};#t={items:".slider__items",item:".slider__item",wrapper:".slider__wrapper",arrowLeft:".slider__arrow_left",arrowRight:".slider__arrow_right"};#i=0;#s=0;#r=0;#o=0;#n=0;#d={x:0,y:0};#l=0;#h=!1;#c=0;#a=document.querySelector(".teams__title");constructor(e){this.#f(e),this.#S(),this.#g()}#f(e){if(this.#e.sliderNode=document.querySelector(e),null===this.#e.sliderNode)throw new Error(`Slider: по селектору ${e} не найден элемент в DOM дереве`);if(this.#e.sliderItemsNode=this.#e.sliderNode.querySelector(this.#t.items),null===this.#e.sliderItemsNode)throw new Error(`Slider: по селектору ${this.#t.items} не найден элемент в DOM дереве`);if(this.#e.sliderItemNodes=Array.from(this.#e.sliderNode.querySelectorAll(this.#t.item)),0===this.#e.sliderItemNodes.length)throw new Error(`Slider: по селектору ${this.#t.item} не найдены элементы слайдера в DOM дереве`);if(this.#e.sliderArrowLeftNode=this.#e.sliderNode.querySelector(this.#t.arrowLeft),null===this.#e.sliderArrowLeftNode)throw new Error(`Slider: по селектору ${this.#t.arrowLeft} не найден элемент в DOM дереве`);if(this.#e.sliderArrowRightNode=this.#e.sliderNode.querySelector(this.#t.arrowRight),null===this.#e.sliderArrowLeftNode)throw new Error(`Slider: по селектору ${this.#t.arrowRight} не найден элемент в DOM дереве`);if(this.#e.sliderWrapperNode=this.#e.sliderNode.querySelector(this.#t.wrapper),null===this.#e.sliderWrapperNode)throw new Error(`Slider: по селектору ${this.#t.wrapper} не найден элемент в DOM дереве`)}#S(){window.addEventListener("resize",this.#u(this.#g,50)),this.#e.sliderArrowLeftNode.addEventListener("click",(()=>{const e=this.#m(-1);this.#p(e)})),this.#e.sliderArrowRightNode.addEventListener("click",(()=>{const e=this.#m(1);this.#p(e)}));for(const e of this.#e.sliderItemNodes)e.addEventListener("pointerdown",this.#N);document.addEventListener("pointerrawupdate",this.#w),document.addEventListener("pointerup",this.#X),document.addEventListener("pointerleave",this.#X)}#N=e=>{if(2===e.button||1===e.button)return!1;this.#h=!0,this.#d={x:e.clientX,y:e.clientY},this.#n=this.#o,console.log("dragStart")};#X=e=>{if(this.#h=!1,0===this.#r)return;const t=this.#r<0?"left":"right";console.log(this.#r,"this.#moveSlideShiftX"),console.log(t);const i=this.#e.sliderItemNodes[this.#l];console.log(i),this.#r=0,this.#g(),console.log("dragStop")};#w=e=>{if(!1===this.#h)return;const t=e.clientX,i=e.clientY,s={x:t-this.#d.x,y:i-this.#d.y};this.#r=s.x,this.#v(),this.#c++,this.#a.innerText=`${this.#c} dragging`,console.log("dragging")};#m(e){const t=this.#e.sliderItemNodes.length;return(this.#l+e+t)%t}#I=()=>{const e=this.#e.sliderItemNodes[this.#l],t=this.#e.sliderItemsNode.offsetWidth,i=e.offsetWidth;this.#i=Math.max((t-i)/2,0)};#x(){const e=this.#e.sliderItemNodes[0].getBoundingClientRect(),t=this.#e.sliderItemNodes[this.#l].getBoundingClientRect().left-e.left;this.#s=t}#y(){this.#o=this.#i-this.#s,this.#e.sliderItemsNode.style.transform=`translateX(${this.#o}px)`}#g=()=>{this.#I(),this.#x(),this.#y()};#v(){this.#o=this.#n+this.#r,this.#e.sliderItemsNode.style.transform=`translateX(${this.#o}px)`}#p(e){this.#l=e,this.#g()}#u(e,t){let i;return function(...s){i&&clearTimeout(i),i=setTimeout((()=>{e.apply(this,s)}),t)}}#L(e,t){let i,s,r=!1;return function o(){if(r)return i=arguments,void(s=this);e.apply(this,arguments),r=!0,setTimeout((function(){r=!1,i&&(o.apply(s,i),i=s=null)}),t)}}}})),s("U28IF");
//# sourceMappingURL=index.0907be8e.js.map
