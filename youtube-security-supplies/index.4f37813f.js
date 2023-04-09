var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},i={},s=e.parcelRequiree4b2;null==s&&((s=function(e){if(e in t)return t[e].exports;if(e in i){var s=i[e];delete i[e];var r={id:e,exports:{}};return t[e]=r,s.call(r.exports,r,r.exports),r.exports}var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){i[e]=t},e.parcelRequiree4b2=s),s.register("U28IF",(function(e,t){var i,s,r,o;i=e.exports,s="Slider",r=()=>n,Object.defineProperty(i,s,{get:r,set:o,enumerable:!0,configurable:!0});class n{#e={sliderNode:null,sliderItemsNode:null,sliderItemNodes:[],sliderArrowLeftNode:null,sliderArrowRightNode:null,sliderWrapperNode:null};#t={items:".slider__items",item:".slider__item",wrapper:".slider__wrapper",arrowLeft:".slider__arrow_left",arrowRight:".slider__arrow_right"};#i=0;#s=0;#r=0;#o={};#n={x:0,y:0};#d=0;#h=!1;#l=0;#a=document.querySelector(".teams__title");constructor(e){this.#c(e),this.#f(),this.#S(),this.#g(),this.#m()}#c(e){if(this.#e.sliderNode=document.querySelector(e),null===this.#e.sliderNode)throw new Error(`Slider: по селектору ${e} не найден элемент в DOM дереве`);if(this.#e.sliderItemsNode=this.#e.sliderNode.querySelector(this.#t.items),null===this.#e.sliderItemsNode)throw new Error(`Slider: по селектору ${this.#t.items} не найден элемент в DOM дереве`);if(this.#e.sliderItemNodes=Array.from(this.#e.sliderNode.querySelectorAll(this.#t.item)),0===this.#e.sliderItemNodes.length)throw new Error(`Slider: по селектору ${this.#t.item} не найдены элементы слайдера в DOM дереве`);if(this.#e.sliderArrowLeftNode=this.#e.sliderNode.querySelector(this.#t.arrowLeft),null===this.#e.sliderArrowLeftNode)throw new Error(`Slider: по селектору ${this.#t.arrowLeft} не найден элемент в DOM дереве`);if(this.#e.sliderArrowRightNode=this.#e.sliderNode.querySelector(this.#t.arrowRight),null===this.#e.sliderArrowLeftNode)throw new Error(`Slider: по селектору ${this.#t.arrowRight} не найден элемент в DOM дереве`);if(this.#e.sliderWrapperNode=this.#e.sliderNode.querySelector(this.#t.wrapper),null===this.#e.sliderWrapperNode)throw new Error(`Slider: по селектору ${this.#t.wrapper} не найден элемент в DOM дереве`)}#f(){window.addEventListener("resize",this.#u(this.#I,50)),this.#e.sliderArrowLeftNode.addEventListener("click",(()=>{const e=this.#v(-1);this.#X(e)})),this.#e.sliderArrowRightNode.addEventListener("click",(()=>{const e=this.#v(1);this.#X(e)}));for(const e of this.#e.sliderItemNodes)e.addEventListener("pointerdown",this.#N);document.addEventListener("pointermove",this.#p),document.addEventListener("pointerout",(e=>{null===e.relatedTarget&&(console.log("Курсор мыши ушёл из браузера"),this.#w(e))})),document.addEventListener("pointerup",this.#w),document.addEventListener("pointerleave",this.#w)}#I=()=>{this.#S(),this.#m()};#N=e=>{const t=e?.touches?e.touches[0].clientX:e.clientX,i=e?.touches?e.touches[0].clientY:e.clientY;if(2===e.button||1===e.button)return!1;this.#h=!0,this.#n={x:t,y:i},this.#r=this.#s,this.#b(),console.log("dragStart")};#w=e=>{this.#h=!1,this.#g(),0!==this.#i&&this.#x(),this.#i=0,console.log("dragStop")};#p=e=>{const t=e.touches?e.touches[0].clientX:e.clientX,i=e.touches?e.touches[0].clientY:e.clientY;if(!1===this.#h)return;const s=i,r={x:t-this.#n.x,y:s-this.#n.y};this.#i=r.x,this.#y(),this.#l++,this.#a.innerText=`${this.#l} dragging`,console.log("dragging")};#x(){const e=this.#i<0?"left":"right";if("left"===e){let e=this.#d+1,t=0,i=Math.abs(this.#i);for(;e<this.#e.sliderItemNodes.length;){const s=0===t?this.#r:this.#o[e-1],r=this.#o[e],o=Math.abs(s-r);i=0!==t?i-o:Math.abs(this.#i);const n=i/o;if(n>=.5&&n<=1){this.#d=e;break}if(n<.5&&0===t)break;if(n<.5&&0!==t){this.#d=e-1;break}if(n>1){if(e+1>=this.#e.sliderItemNodes.length){this.#d=e;break}e++,t++}else;}this.#m(this.#d)}else if("right"===e){let e=this.#d-1,t=0,i=this.#i;for(;e>=0;){const s=0===t?this.#r:this.#o[e+1],r=this.#o[e],o=Math.abs(s-r);i=0!==t?i-o:this.#i;const n=Math.abs(i)/o;if(n>=.5&&n<=1){this.#d=e;break}if(n<.5&&0===t)break;if(n<.5&&0!==t){this.#d=e+1;break}if(n>1){if(e-1<0){this.#d=e;break}e--,t++}else;}this.#m(this.#d)}}#g(){this.#e.sliderItemsNode.style.transitionDuration="0.2s"}#b(){this.#e.sliderItemsNode.style.transitionDuration="0s"}#S(){this.#o={};for(let e=0;e<this.#e.sliderItemNodes.length;e++)this.#o[e]=this.#E(e);console.log(this.#o)}#v(e){const t=this.#e.sliderItemNodes.length;return(this.#d+e+t)%t}#L=(e=this.#d)=>{const t=this.#e.sliderItemNodes[e],i=this.#e.sliderItemsNode.offsetWidth,s=t.offsetWidth;return Math.max((i-s)/2,0)};#M(e=this.#d){const t=this.#e.sliderItemNodes[0].getBoundingClientRect();return this.#e.sliderItemNodes[e].getBoundingClientRect().left-t.left}#E(e=this.#d){return this.#L(e)-this.#M(e)}#m=(e=this.#d)=>{this.#s=this.#o[e],this.#e.sliderItemsNode.style.transform=`translateX(${this.#s}px)`};#y(){this.#s=this.#r+this.#i,this.#e.sliderItemsNode.style.transform=`translateX(${this.#s}px)`}#X(e){this.#d=e,this.#m()}#u(e,t){let i;return function(...s){i&&clearTimeout(i),i=setTimeout((()=>{e.apply(this,s)}),t)}}}})),s("U28IF");
//# sourceMappingURL=index.4f37813f.js.map
