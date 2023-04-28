import { animateOnScroll } from "./funcs.js";

const introTitleNode = document.querySelector('.intro__title');
const introDescriptionNode = document.querySelector('.intro__description');
const introBtnNode = document.querySelector('.intro__btn');
const introImgNode = document.querySelector('.intro__right-img');
const teamsSliderItemNodes = document.querySelectorAll('.teams__slider-item');
const teamsSliderNode = document.querySelector('.teams__slider');

function gsapAnims() {
	gsap.defaults({ duration: 1, ease: 'ease' });

	const tlIntroImg = gsap.timeline();
	tlIntroImg.add(gsap.set(introImgNode, { scale: 1.2 }));
	tlIntroImg.fromTo(introImgNode, { y: '40%' }, { opacity: 1, y: 0 });
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
}

gsapAnims();


for (let i = 0; i < teamsSliderItemNodes.length; i++) {
	if (i % 2 === 0) { // проверка на нечётные в дерве
		teamsSliderItemNodes[i].classList.add('teams__slider-item_odd');
	} else {
		teamsSliderItemNodes[i].classList.add('teams__slider-item_even');
	}
}


const swiper = new Swiper(teamsSliderNode, {
	slidesPerView: 'auto',
	// loop: true,
	spaceBetween: 30,
	loop: true,
	roundLengths: true,
	centeredSlides: true,
	navigation: {
		nextEl: ".teams__slider__arrow_right",
		prevEl: ".teams__slider__arrow_left",
	}
});


animateOnScroll({
	node: teamsSliderNode,
	direction: 'right',
});

window.animateOnScroll = animateOnScroll;


export { };

