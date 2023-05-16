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


export function animateOnScroll({node, direction = null, cb = () => {}, cbOnce = () => {}, duration = 1}) {
	const coordsAnim = {};
	const shift = 200;
	const notAnimDefault = direction === null;

	if (!Element.prototype.isPrototypeOf(node)) {
		throw new Error('node не является узлом DOM');
	}

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
			cbOnce();
			if (notAnimDefault === true) return;

			gsap.set(node, {
				opacity: 0,
				...coordsAnim
			});

		},
		cb: () => {
			cb(node);
			if (notAnimDefault === true) return;
			gsap.to(node, {
				opacity: 1,
				y: 0,
				x: 0,
				duration: duration
			});
		},
	});
}
