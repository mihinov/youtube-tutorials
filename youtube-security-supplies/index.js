const leftNode = document.querySelector('.intro__left');
const rightNode = document.querySelector('.intro__right-img')
const containerNode = document.querySelector('.intro .container');

setInterval(() => {
	// console.log(getComputedStyle(leftNode).getPropertyValue('width'), 'leftNode width');
	// console.log(containerNode.offsetWidth);
	console.log(getComputedStyle(rightNode).getPropertyValue('right'), 'rightNode');
}, 500);
