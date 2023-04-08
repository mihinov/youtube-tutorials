export class Slider {

	#nodes = {
		sliderNode: null,
		sliderItemsNode: null,
		sliderItemNodes: [],
		sliderArrowLeftNode: null,
		sliderArrowRightNode: null,
		sliderWrapperNode: null
	};

	#cssSelectors = {
		items: '.slider__items',
		item: '.slider__item',
		wrapper: '.slider__wrapper',
		arrowLeft: '.slider__arrow_left',
		arrowRight: '.slider__arrow_right'
	};

	#centeringShiftX = 0;
	#changeSlideShiftX = 0;
	#moveSlideShiftX = 0;
	#shiftX = 0;
	#lastShifX = 0;

	#startMovePos = {
		x: 0,
		y: 0
	};

	#activeItemIndex = 0;

	#isDragging = false;
	#countDragging = 0;

	#teamsTitleNode = document.querySelector('.teams__title');


	constructor(sliderSelector) {
		this.#initNodes(sliderSelector);
		this.#initEventListeners();
		this.#calcAndSetShiftX();
	}

	#initNodes(sliderSelector) {
		this.#nodes.sliderNode = document.querySelector(sliderSelector);
		if (this.#nodes.sliderNode === null) {
			throw new Error(`Slider: по селектору ${sliderSelector} не найден элемент в DOM дереве`);
		}

		this.#nodes.sliderItemsNode = this.#nodes.sliderNode.querySelector(this.#cssSelectors.items);
		if (this.#nodes.sliderItemsNode === null) {
			throw new Error(`Slider: по селектору ${this.#cssSelectors.items} не найден элемент в DOM дереве`);
		}

		this.#nodes.sliderItemNodes = Array.from(this.#nodes.sliderNode.querySelectorAll(this.#cssSelectors.item));
		if (this.#nodes.sliderItemNodes.length === 0) {
			throw new Error(`Slider: по селектору ${this.#cssSelectors.item} не найдены элементы слайдера в DOM дереве`);
		}

		this.#nodes.sliderArrowLeftNode = this.#nodes.sliderNode.querySelector(this.#cssSelectors.arrowLeft);
		if (this.#nodes.sliderArrowLeftNode === null) {
			throw new Error(`Slider: по селектору ${this.#cssSelectors.arrowLeft} не найден элемент в DOM дереве`);
		}

		this.#nodes.sliderArrowRightNode = this.#nodes.sliderNode.querySelector(this.#cssSelectors.arrowRight);
		if (this.#nodes.sliderArrowLeftNode === null) {
			throw new Error(`Slider: по селектору ${this.#cssSelectors.arrowRight} не найден элемент в DOM дереве`);
		}

		this.#nodes.sliderWrapperNode = this.#nodes.sliderNode.querySelector(this.#cssSelectors.wrapper);
		if (this.#nodes.sliderWrapperNode === null) {
			throw new Error(`Slider: по селектору ${this.#cssSelectors.wrapper} не найден элемент в DOM дереве`);
		}

	}

	#initEventListeners() {
		window.addEventListener('resize', this.#debounce(this.#calcAndSetShiftX, 50));

		this.#nodes.sliderArrowLeftNode.addEventListener('click', () => {
			const nextIndex = this.#getNextIndex(-1);
			this.#changeSlide(nextIndex);
		});

		this.#nodes.sliderArrowRightNode.addEventListener('click', () => {
			const nextIndex = this.#getNextIndex(1);
			this.#changeSlide(nextIndex);
		});

		for (const sliderNode of this.#nodes.sliderItemNodes) {
			sliderNode.addEventListener('pointerdown', this.#dragStart);
		}

		document.addEventListener('pointerrawupdate', this.#dragging);
		document.addEventListener('pointerup', this.#dragStop);
		document.addEventListener('pointerleave', this.#dragStop);
	}

	#dragStart = (e) => {
		if (e.button === 2 || e.button === 1) return false; // Если это правая или средняя кнопка мыши, это не тот клик
		this.#isDragging = true;
		this.#startMovePos = { x: e.clientX, y: e.clientY };
		this.#lastShifX = this.#shiftX;
		console.log('dragStart');
	}

	#dragStop = (e) => {
		this.#isDragging = false;
		if (this.#moveSlideShiftX === 0) return;
		const dir = this.#moveSlideShiftX < 0 ? 'left' : 'right';
		console.log(this.#moveSlideShiftX, 'this.#moveSlideShiftX');
		console.log(dir);
		const currentSliderNode = this.#nodes.sliderItemNodes[this.#activeItemIndex];
		console.log(currentSliderNode);

		if (dir === 'left') {

		}

		this.#moveSlideShiftX = 0;
		this.#calcAndSetShiftX();
		console.log('dragStop');
	}

	#dragging = (e) => {
		if (this.#isDragging === false) return;

		const nextMovePos = { x: e.clientX, y: e.clientY };
		const diffMovePos = { x: nextMovePos.x - this.#startMovePos.x, y: nextMovePos.y - this.#startMovePos.y };

		this.#moveSlideShiftX = diffMovePos.x;
		this.#calcMoveSlideShiftX();
		this.#countDragging++;
		this.#teamsTitleNode.innerText = `${this.#countDragging} dragging`;

		console.log('dragging');
	}

	#getNextIndex(dir) {
		const quantityItems = this.#nodes.sliderItemNodes.length;
		return (this.#activeItemIndex + dir + quantityItems) % quantityItems;
	}

	#setCenteringShiftX = () => {
		const firstSliderItemNode = this.#nodes.sliderItemNodes[this.#activeItemIndex];
		const sliderItemsNode = this.#nodes.sliderItemsNode;

		const widthSlider = sliderItemsNode.offsetWidth;
		const widthFirstSliderItem = firstSliderItemNode.offsetWidth;

		this.#centeringShiftX = Math.max((widthSlider - widthFirstSliderItem) / 2, 0);
	}

	#setChangeSlideShiftX() {
		const firstRect = this.#nodes.sliderItemNodes[0].getBoundingClientRect();
		const nextRect = this.#nodes.sliderItemNodes[this.#activeItemIndex].getBoundingClientRect();
		const diffLeftNextSlide = nextRect.left - firstRect.left;

		this.#changeSlideShiftX = diffLeftNextSlide;
	}

	#setShiftX() {
		this.#shiftX = this.#centeringShiftX - this.#changeSlideShiftX;
		this.#nodes.sliderItemsNode.style.transform = `translateX(${this.#shiftX}px)`;
	}

	#calcAndSetShiftX = () => {
		this.#setCenteringShiftX();
		this.#setChangeSlideShiftX();
		this.#setShiftX();
	}

	#calcMoveSlideShiftX() {
		this.#shiftX = this.#lastShifX + this.#moveSlideShiftX;

		this.#nodes.sliderItemsNode.style.transform = `translateX(${this.#shiftX}px)`;
	}

	#changeSlide(nextIndex) {
		this.#activeItemIndex = nextIndex;
		this.#calcAndSetShiftX();
	}

	#debounce(func, delay) {
		let timeoutId;
		return function(...args) {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	#throttle(func, ms) {

		let isThrottled = false,
			savedArgs,
			savedThis;

		function wrapper() {

			if (isThrottled) { // (2)
				savedArgs = arguments;
				savedThis = this;
				return;
			}

			func.apply(this, arguments); // (1)

			isThrottled = true;

			setTimeout(function() {
				isThrottled = false; // (3)
				if (savedArgs) {
					wrapper.apply(savedThis, savedArgs);
					savedArgs = savedThis = null;
				}
			}, ms);
		}

		return wrapper;
	}



}

