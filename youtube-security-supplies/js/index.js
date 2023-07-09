import { animateOnScroll } from "./funcs.js";

const teamsSliderNode = document.querySelector('.teams__slider');
const teamsSliderItemNodes = document.querySelectorAll('.teams__slider-item');
const headerLinkNodes = document.querySelectorAll('.header .link');
const headerNode = document.querySelector('.header');
const introTitleNode = document.querySelector('.intro__title');
const introDescriptionNode = document.querySelector('.intro__description');
const introLinkNode = document.querySelector('.intro__link');
const introImgNode = document.querySelector('.intro__img');
const introLeftAndRightNode = document.querySelector('.intro__left-and-right');
const introCompaniesNode = document.querySelector('.intro__companies');
const introCompaniesAnimationNodes = document.querySelectorAll('.intro__companies-text, .intro__companies-img');
const dealsSectionHeaderNode = document.querySelector('.deals__section-header');
const dealsSectionHeaderAnimationNodes = document.querySelectorAll('.deals__section-header > *');
const dealsTwoNode = document.querySelector('.deals__two');
const dealsTwoAnimationNodes = document.querySelectorAll('.deals__two-left, .deals__two-right');
const vendorSectionHeaderNode = document.querySelector('.vendor__section-header');
const vendorSectionHeaderAnimationNodes = document.querySelectorAll('.vendor__section-header > *');
const vendorTwoNode = document.querySelector('.vendor__two');
const vendorTwoAnimationNodes = document.querySelectorAll('.vendor__two-left, .vendor__two-right');
const teamsTitleNode = document.querySelector('.teams__title');
const securityNode = document.querySelector('.security');
const securitySectionHeaderNode = document.querySelector('.security__section-header');
const securitySectionAnimationNodes = document.querySelectorAll('.security__section-header > *');
const securityImgNode = document.querySelector('.security__img');
const footerNode = document.querySelector('.footer');
const footerAnimNodes = document.querySelectorAll('.footer__logo, .footer__column-item');

function initSwiperSlider() {

	const addClassesSliderItems = () => {

		for (let i = 0; i < teamsSliderItemNodes.length; i++) {
			if ( (i + 1) % 2 === 1 ) {
				teamsSliderItemNodes[i].classList.add('teams__slider-item_odd');
			} else {
				teamsSliderItemNodes[i].classList.add('teams__slider-item_even');
			}
		}

	};

	addClassesSliderItems();

	const swiper = new Swiper(teamsSliderNode, {
		slidesPerView: 'auto',
		spaceBetween: 30,
		loop: true,
		roundLengths: true,
		centeredSlides: true,
		navigation: {
			nextEl: ".teams__slider-arrow_right",
			prevEl: ".teams__slider-arrow_left",
		},
	});

}

function gsapAnims() {
	gsap.defaults({ duration: 1, ease: 'ease' });

	animateOnScroll({
		node: headerNode,
		cbOnce: () => {
			gsap.set(headerLinkNodes, { opacity: 0 });
		},
		cb: () => {
			gsap.to(headerLinkNodes, {
				opacity: 1,
				stagger: 0.3
			});
		}
	});

	animateOnScroll({
		node: introLeftAndRightNode,
		cbOnce: () => {
			gsap.set(introTitleNode, { x: '40%', opacity: 0 });
			gsap.set(introDescriptionNode, { x: '-40%', opacity: 0 });
			gsap.set(introLinkNode, { scale: 1.5, opacity: 0 });
			gsap.set(introImgNode, { scale: 1.2, opacity: 0, y: '60%' });
		},
		cb: () => {
			gsap.timeline()
				.to(introTitleNode, { x: 0, opacity: 1 })
				.to(introDescriptionNode, { x: 0, opacity: 1 })
				.to(introLinkNode, { scale: 1, opacity: 1 })
				.to(introImgNode, { y: 0, opacity: 1 })
				.to(introImgNode, { scale: 1 });
		}
	});

	animateOnScroll({
		node: introCompaniesNode,
		cbOnce: () => {
			gsap.set(introCompaniesAnimationNodes, { opacity: 0 });
		},
		cb: () => {
			gsap.to(introCompaniesAnimationNodes, {
				opacity: 1,
				stagger: 0.5,
				delay: 0.5
			});
		}
	});

	animateOnScroll({
		node: dealsSectionHeaderNode,
		cbOnce: () => {
			gsap.set(dealsSectionHeaderAnimationNodes, {
				opacity: 0,
				scale: (i) =>	i % 2 === 0 ? 2 : 0
			});
		},
		cb: () => {
			gsap.to(dealsSectionHeaderAnimationNodes, {
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
			gsap.set(dealsTwoAnimationNodes, {
				opacity: 0,
				scale: 0
			});
		},
		cb: () => {
			gsap.to(dealsTwoAnimationNodes, {
				opacity: 1,
				scale: 1,
				stagger: 0.5,
				delay: 0.5
			});
		}
	});

	animateOnScroll({
		node: vendorSectionHeaderNode,
		cbOnce: () => {
			gsap.set(vendorSectionHeaderAnimationNodes, {
				opacity: 0,
				scale: (i) =>	i % 2 === 0 ? 2 : 0
			});
		},
		cb: () => {
			gsap.to(vendorSectionHeaderAnimationNodes, {
				opacity: 1,
				scale: 1,
				stagger: 0.5,
				delay: 0.5
			});
		}
	});

	animateOnScroll({
		node: vendorTwoNode,
		cbOnce: () => {
			gsap.set(vendorTwoAnimationNodes, {
				opacity: 0,
				scale: 0
			});
		},
		cb: () => {
			gsap.to(vendorTwoAnimationNodes, {
				opacity: 1,
				scale: 1,
				stagger: 0.5,
				delay: 0.5
			});
		}
	});

	animateOnScroll({
		node: teamsTitleNode,
		cbOnce: () => {
			gsap.set(teamsTitleNode, {
				opacity: 0,
				scale: 1.5
			});
		},
		cb: () => {
			gsap.to(teamsTitleNode, {
				opacity: 1,
				scale: 1
			})
		}
	});

	animateOnScroll({
		node: teamsSliderNode,
		cbOnce: () => {
			gsap.set(teamsSliderNode, {
				opacity: 0,
				x: '-40%'
			});
		},
		cb: () => {
			gsap.to(teamsSliderNode, {
				opacity: 1,
				x: 0,
				delay: 0.5
			});
		}
	});


	animateOnScroll({
		node: securitySectionHeaderNode,
		cbOnce: () => {
			gsap.set(securitySectionAnimationNodes, {
				opacity: 0,
				scale: (i) =>	i % 2 === 1 ? 2 : 0
			});
		},
		cb: () => {
			gsap.to(securitySectionAnimationNodes, {
				opacity: 1,
				scale: 1,
				stagger: 0.5,
				delay: 0.5
			});
		}
	});

	animateOnScroll({
		node: securityNode,
		cbOnce: () => {
			gsap.set(securityImgNode, {
				opacity: 0,
				x: '500%'
			})
		},
		cb: () => {
			gsap.to(securityImgNode, {
				opacity: 1,
				x: 0
			});
		}
	});

	animateOnScroll({
		node: footerNode,
		cbOnce: () => {
			gsap.set(footerAnimNodes, { opacity: 0 });
		},
		cb: () => {
			gsap.to(footerAnimNodes, {
				opacity: 1,
				stagger: 0.3,
				delay: 0.5
			});
		}
	});


}

initSwiperSlider();
gsapAnims();
