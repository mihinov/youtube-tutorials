export class Slider {

	#nodes = {
		sliderNode: null,
		sliderItemsNode: null,
		sliderItemNodes: [],
		sliderArrowLeftNode: null,
		sliderArrowRightNode: null
	};

	#cssSelectors = {
		items: '.slider__items',
		item: '.slider__item',
		arrowLeft: '.slider__arrow_left',
		arrowRight: '.slider__arrow_right'
	};

	#centeringShiftX = 0;
	#changeSlideShiftX = 0;
	#shiftX = 0;

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

		this.#nodes.sliderItemsNode.addEventListener('pointerdown', this.#dragStart);
		document.addEventListener('pointermove', this.#dragging);
		// this.#nodes.sliderItemsNode.addEventListener('touchmove', this.#dragging);
		this.#nodes.sliderItemsNode.addEventListener('pointerup', this.#dragStop);
	}

	#dragStart = (e) => {
		console.log('dragStart');
	}

	#dragStop = (e) => {
		console.log('dragStop');
	}

	#dragging = (e) => {

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



}

