function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth =
    window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
}

function observeElement({ node, cb, cbOnce }) {
	cbOnce(node);

  if (isElementInViewport(node)) {
    cb(node);
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cb(node);
        observer.disconnect();
      }
    });
  });

  observer.observe(node);
}


export function animateOnScroll(node, direction, cb = () => {}) {
	const coordsAnim = {};

	const shift = 200;

	if (direction === 'left') {
		coordsAnim.x = -shift;
	} else if (direction === 'right') {
		coordsAnim.x = shift;
	} else if (direction === 'top') {
		coordsAnim.y = -shift;
	} else if (direction === 'bottom') {
		coordsAnim.y = shift;
	}

	observeElement({
		node: node,
		cbOnce: () => {
			gsap.set(node, {
				opacity: 0,
				...coordsAnim
			});
		},
		cb: () => {
			cb(node);
			gsap.to(node, {
				opacity: 1,
				y: 0,
				x: 0,
				duration: 1.5
			});
		},
	});
}
