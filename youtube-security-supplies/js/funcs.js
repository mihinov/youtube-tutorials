export function animateOnScroll({node, cbOnce = () => {}, cb = () => {}}) {
	cbOnce(node);

	if (isElementInViewport(node) === true) {
		cb(node);
		return;
	}

	observeElement(node, cb);
}

function isElementInViewport(node) {
  const rect = node.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
}

function observeElement(node, cb) {
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
