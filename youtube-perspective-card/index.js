const htmlNode = document.documentElement;
const defaultMouseX = parseFloat(getComputedStyle(htmlNode).getPropertyValue('--mouse-x'));
const defaultMouseY = parseFloat(getComputedStyle(htmlNode).getPropertyValue('--mouse-y'));

let currentX = 0;
let currentY = 0;
let lastCurrentX = 0;
let lastCurrentY = 0;
let targetX = 0;
let targetY = 0;
let targetXPercent = 0;
let targetYPercent = 0;
let animated = false;
const ease = 0.05; // значение, определяющее скорость анимации или изменения координат

window.addEventListener('pointermove', onMove);
window.addEventListener('resize', onResize);

function onResize(e) {
	targetX = targetXPercent * window.innerWidth;
	targetY = targetYPercent * window.innerHeight;
}

function onMove(e) {
  targetX = e.touches ? e.touches[0].clientX : e.clientX;
  targetY = e.touches ? e.touches[0].clientY : e.clientY;

	// это сделано, чтобы не выходить за пределы экрана браузера
	targetX = Math.min(Math.max(targetX, 0), window.innerWidth);
	targetY = Math.min(Math.max(targetY, 0), window.innerHeight);
	// это сделано, чтобы не выходить за пределы экрана браузера

	targetXPercent = targetX / window.innerWidth;
	targetYPercent = targetY / window.innerHeight;

	animated = true;
}

function animate() {
	if (animated === false) {
		targetX = defaultMouseX * window.innerWidth;
		targetY = defaultMouseY * window.innerHeight;
		targetXPercent = targetX / window.innerWidth;
		targetYPercent = targetY / window.innerHeight;
		currentX = targetX;
		currentY = targetY;
		animated = true;
	}

	currentX = currentX + ((targetX - currentX) * ease);
	currentY = currentY + ((targetY - currentY) * ease);

	// преобразуем координаты в диапазон от 0 до 1
	let x = currentX / window.innerWidth;
	let y = currentY / window.innerHeight;

	// округляем до 3 чисел после запятой
	x = parseFloat(x.toFixed(3));
	y = parseFloat(y.toFixed(3));

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
