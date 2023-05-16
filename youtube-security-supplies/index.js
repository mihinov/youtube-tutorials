import { animateOnScroll } from "./funcs.js";

const introTitleNode = document.querySelector('.intro__title');
const introDescriptionNode = document.querySelector('.intro__description');
const introBtnNode = document.querySelector('.intro__btn');
const introImgNode = document.querySelector('.intro__right-img');
const teamsSliderItemNodes = document.querySelectorAll('.teams__slider-item');
const teamsSliderNode = document.querySelector('.teams__slider');
const headerItemAnimNodes = document.querySelectorAll('.header__nav-link, .header__btn-sign-in, .header__btn-started');
const headerNode = document.querySelector('.header');
const introCompaniesNode = document.querySelector('.intro__companies');
const introCompaniesAnimNodes = document.querySelectorAll('.intro__companies-text, .intro__companies-img-wrapper');
const dealsHeaderNode = document.querySelector('.deals__section-header');
const dealsHeaderAnimNodes = document.querySelectorAll('.deals__section-header > *');
const dealsTwoNode = document.querySelector('.deals__two');
const dealsTwoAnimNodes = document.querySelectorAll('.deals__two > *');
const vendorsHeaderNode = document.querySelector('.vendors__section-header');
const vendorsHeaderAnimNodes = document.querySelectorAll('.vendors__section-header > *');
const vendorsTwoNode = document.querySelector('.vendors__two');
const vendorsTwoAnimNodes = document.querySelectorAll('.vendors__two > *');
const teamsHeaderNode = document.querySelector('.teams__section-header');
const securityHeaderNode = document.querySelector('.security__section-header');
const securityHeaderAnimNodes = document.querySelectorAll('.security__section-header > *');
const footerNode = document.querySelector('.footer');
const footerAnimNodes = document.querySelectorAll('.footer__logo, .footer__column > *');

function gsapAnims() {
	gsap.defaults({ duration: 1, ease: 'ease' });

	const tlIntroImg = gsap.timeline();
	tlIntroImg.add(gsap.set(introImgNode, { scale: 1.2 }));
	tlIntroImg.fromTo(introImgNode, { y: '40%' }, { opacity: 1, y: 0 });
	tlIntroImg.to(introImgNode, { scale: 1 });
	tlIntroImg.pause();

	const tlIntroLeft = gsap.timeline()
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

		tlIntroLeft.pause();

		animateOnScroll({
			node: introTitleNode,
			cb: () => {
				tlIntroLeft.play();
			}
		});


		animateOnScroll({
			node: teamsSliderNode,
			cbOnce: () => {
				gsap.set(teamsSliderNode, { opacity: 0, x: -400 });
			},
			cb: () => {
				gsap.to(teamsSliderNode, { opacity: 1, x: 0, delay: 0.5 });
			}
		});

		animateOnScroll({
			node: headerNode,
			cbOnce: () => {
				gsap.set(headerItemAnimNodes, { opacity: 0 });
			},
			cb: () => {
				gsap.to(headerItemAnimNodes, {
					opacity: 1,
					stagger: 0.3,
				});
			}
		});

		animateOnScroll({
			node: introCompaniesNode,
			cbOnce: () => {
				gsap.set(introCompaniesAnimNodes, { opacity: 0 });
			},
			cb: () => {
				gsap.to(introCompaniesAnimNodes, {
					opacity: 1,
					stagger: 0.5,
					delay: 0.5
				});
			}
		});

		animateOnScroll({
			node: dealsHeaderNode,
			cbOnce: () => {
				gsap.set(dealsHeaderAnimNodes, {
					opacity: 0,
					scale: (i) => (i % 2 === 0 ? 2 : 0)
				});
			},
			cb: () => {
				gsap.to(dealsHeaderAnimNodes, {
					opacity: 1,
					scale: 1,
					stagger: 0.5,
					delay: 0.5
				});
			}
		});

		animateOnScroll({
			node: dealsTwoNode,
			cbOnce: () => {
				gsap.set(dealsTwoAnimNodes, { opacity: 0, scale: 0 });
			},
			cb: () => {
				gsap.to(dealsTwoAnimNodes, {
					stagger: 1,
					delay: 0.5,
					opacity: 1,
					scale: 1
				});
			}
		});

		animateOnScroll({
			node: vendorsHeaderNode,
			cbOnce: () => {
				gsap.set(vendorsHeaderAnimNodes, {
					opacity: 0,
					scale: (i) => (i % 2 === 0 ? 2 : 0)
				});
			},
			cb: () => {
				gsap.to(vendorsHeaderAnimNodes, {
					opacity: 1,
					scale: 1,
					stagger: 0.5,
					delay: 0.5
				});
			}
		});

		animateOnScroll({
			node: vendorsTwoNode,
			cbOnce: () => {
				gsap.set(vendorsTwoAnimNodes, { opacity: 0, scale: 0 });
			},
			cb: () => {
				gsap.to(vendorsTwoAnimNodes, {
					stagger: 1,
					delay: 0.5,
					opacity: 1,
					scale: 1
				});
			}
		});

		animateOnScroll({
			node: teamsHeaderNode,
			cbOnce: () => {
				gsap.set(teamsHeaderNode, { opacity: 0, scale: 2 });
			},
			cb: () => {
				gsap.to(teamsHeaderNode, {
					scale: 1,
					opacity: 1
				});
			}
		});

		animateOnScroll({
			node: securityHeaderNode,
			cbOnce: () => {
				gsap.set(securityHeaderAnimNodes, {
					opacity: 0,
					scale: (i) => (i % 2 === 0 ? 2 : 0)
				});
			},
			cb: () => {
				gsap.to(securityHeaderAnimNodes, {
					opacity: 1,
					scale: 1,
					stagger: 0.5,
					delay: 0.5
				});
			}
		});

		animateOnScroll({
			node: footerNode,
			cbOnce: () => {
				gsap.set(footerAnimNodes, {
					opacity: 0
				});
			},
			cb: () => {
				gsap.to(footerAnimNodes, {
					stagger: 0.15,
					delay: 0.5,
					opacity: 1
				});
			}
		});

}

function initSwiperSlider() {
	const addClassesSliderItems = () => {
		for (let i = 0; i < teamsSliderItemNodes.length; i++) {
			if (i % 2 === 0) { // проверка на нечётные в дерве
				teamsSliderItemNodes[i].classList.add('teams__slider-item_odd');
			} else {
				teamsSliderItemNodes[i].classList.add('teams__slider-item_even');
			}
		}
	}

	addClassesSliderItems();

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

}

initSwiperSlider();
gsapAnims();

