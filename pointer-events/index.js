const dragStart = (e) => {
	if (isDrawing === true) return;

	isDrawing = true;
	lastX = e.clientX;
	lastY = e.clientY;
	drawPoint(lastX, lastY);
};

const dragMove = (e) => {
	if (isDrawing === false) return;
	drawLine(lastX, lastY, e.clientX, e.clientY);
	lastX = e.clientX;
	lastY = e.clientY;
};

const dragStop = (e) => {
	if (isDrawing === false) return;
	isDrawing = false;
	drawSquare(e.clientX, e.clientY);
};

function setSizeCanvas() {
	const { width, height } = canvasNode.getBoundingClientRect();

	canvasNode.width = width;
	canvasNode.height = height;
}

function resize(event) {
	drawCanvas();
}

function drawCanvas() {
	setSizeCanvas();
	ctx.fillStyle = getBgColor();
	ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawPoint(x, y) {
	const vmin = Math.min(canvasNode.clientWidth, canvasNode.clientHeight);
	ctx.fillStyle = getColor();
	ctx.beginPath();
	ctx.arc(x, y, vmin * 0.04, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
	const vmin = Math.min(canvasNode.clientWidth, canvasNode.clientHeight);
	ctx.strokeStyle = getColor();
	ctx.lineJoin = "round"; // добавить это значение
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineWidth = vmin * 0.02; // изменить значение толщины линии
	ctx.closePath();
	ctx.stroke();
}

function drawSquare(x, y) {
	const vmin = Math.min(canvasNode.clientWidth, canvasNode.clientHeight);
	const widthSquare = vmin * 0.05;
	ctx.beginPath();
	ctx.rect(x - widthSquare / 2, y - widthSquare / 2, widthSquare, widthSquare);
	ctx.closePath();
	ctx.fillStyle = 'yellow';
	ctx.fill();
}







const canvasNode = document.querySelector('.canvas');
const ctx = canvasNode.getContext('2d');
const htmlNode = window.document.documentElement;
const getBgColor = () => getComputedStyle(htmlNode).getPropertyValue('--bgColor');
const getColor = () => getComputedStyle(htmlNode).getPropertyValue('--color');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

drawCanvas()

window.addEventListener('resize', resize);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
	drawCanvas();
});
