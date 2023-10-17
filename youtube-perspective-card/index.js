const htmlNode = document.documentElement;
const defaultMouseX = parseFloat(getComputedStyle(htmlNode).getPropertyValue('--mouse-x'));
const defaultMouseY = parseFloat(getComputedStyle(htmlNode).getPropertyValue('--mouse-y'));

let currentX = 0;
let currentY = 0;
let lastCurrentX = 0;
let lastCurrentY = 0;
let targetX = 0;
let targetY = 0;
let animated = false;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const ease = 0.05; // значение, определяющее скорость анимации или изменения координат

window.addEventListener('pointermove', onMove);
window.addEventListener('resize', onResize);

function onResize(e) {
	const lastTargetXPercent = window.innerWidth / targetX;
	const lastTargetYPercent = window.innerHeight / targetY;

	console.log(lastTargetXPercent);
}

function onMove(e) {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  targetX = e.touches ? e.touches[0].clientX : e.clientX;
  targetY = e.touches ? e.touches[0].clientY : e.clientY;

	// это сделано, чтобы не выходить за пределы экрана браузера
	targetX = Math.min(Math.max(targetX, 0), windowWidth);
	targetY = Math.min(Math.max(targetY, 0), windowHeight);
	// это сделано, чтобы не выходить за пределы экрана браузера

	animated = true;
}

function animate() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	if (animated === false) {
		targetX = defaultMouseX * windowWidth;
		targetY = defaultMouseY * windowHeight;
		currentX = targetX;
		currentY = targetY;
		animated = true;
	}

	currentX = currentX + ((targetX - currentX) * ease);
	currentY = currentY + ((targetY - currentY) * ease);

	// преобразуем координаты в диапазон от 0 до 1
	let x = currentX / windowWidth;
	let y = currentY / windowHeight;

	// округляем до 3 чисел после запятой
	x = parseFloat(x.toFixed(3));
	y = parseFloat(y.toFixed(3));

  // Получаем прошлые CSS значения x и y, если они не равнялись прошлым, то перезаписать их

	// устанавливаем соответствующие CSS-переменные
  if (x !== lastCurrentX) {
    document.documentElement.style.setProperty('--mouse-x', x);
		lastCurrentX = x;
  }

  if (y !== lastCurrentY) {
    document.documentElement.style.setProperty('--mouse-y', y);
		lastCurrentY = y;
  }


	requestAnimationFrame(animate);
}

animate();
