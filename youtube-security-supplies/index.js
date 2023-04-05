import { Slider } from "./slider/slider.js";

const introTitleNode = document.querySelector('.intro__title');
const introDescriptionNode = document.querySelector('.intro__description');
const introBtnNode = document.querySelector('.intro__btn');
const introImgNode = document.querySelector('.intro__right-img');

gsap.defaults({ duration: 1, ease: 'ease' });

const tlIntroImg = gsap.timeline();
tlIntroImg.add(gsap.set(introImgNode, { scale: 1.2 }));
tlIntroImg.fromTo(introImgNode, { y: '40%'}, { opacity: 1, y: 0 });
tlIntroImg.to(introImgNode, { scale: 1 });
tlIntroImg.pause();

const tlLeft = gsap.timeline()
.from(introTitleNode, {
	opacity: 0,
	x: '40%'
})
.from(introDescriptionNode, {
	opacity: 0,
	x: '-40%'
})
.from(introBtnNode, {
	opacity: 0,
	scale: 1.5,
}).add(tlIntroImg.play());





const slider = new Slider('.teams__slider');


















export {};

