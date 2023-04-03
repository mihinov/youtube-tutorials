const percentNode = document.querySelector('.progressbar__percent tspan');
const infoNode = document.querySelector('.progressbar__info tspan');
const svgNode = document.querySelector('.progressbar');

function onUpdateGsap() {
	const percent = gsap.getProperty(svgNode, '--percent');

	if (percent > 99) {
    infoNode.textContent = 'Закончили?';
  } else if (percent > 60 && percent < 99) {
    infoNode.textContent = 'Разгоняемся!';
  } else if (percent > 40 && percent < 60) {
    infoNode.textContent = 'Погнали!';
  } else if (percent > 0 && percent < 40) {
    infoNode.textContent = 'Загрузочка ...'
  }

  percentNode.textContent = Math.round(percent);
}


const tl = gsap.timeline()
.to(svgNode, { '--opacityThumb': 1, duration: 0.2 })
.to(svgNode, { '--percent': 100, duration: 5, ease: 'linear', onUpdate: onUpdateGsap });
