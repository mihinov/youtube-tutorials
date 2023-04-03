export class Slider {

	nodes = {
		sliderNode: null,
		sliderItemsNode: null,
		sliderItemNodes: []
	};

	cssClasses = {
		items: 'slider__items',
		item: 'slider__item'
	};

	constructor(sliderSelector) {
		this.initNodes(sliderSelector);
	}

	initNodes(sliderSelector) {
		this.nodes.sliderNode = document.querySelector(sliderSelector);
		if (this.nodes.sliderNode === null) {
			throw new Error(`Slider: по селектору ${sliderSelector} не найден элемент в DOM дереве`);
		}

		this.nodes.sliderItemsNode = this.nodes.sliderNode.querySelector(this.cssClasses.items);
		if (this.nodes.sliderItemsNode === null) {
			throw new Error(`Slider: по селектору ${this.cssClasses.items} не найден элемент в DOM дереве`);
		}

		this.nodes.sliderItemNodes = Array.from(this.nodes.sliderNode.querySelectorAll(this.cssClasses.item));
		if (this.nodes.sliderItemNodes.length === 0) {
			throw new Error(`Slider: по селектору ${this.cssClasses.item} не найдены элементы слайдера в DOM дереве`);
		}

	}


}
