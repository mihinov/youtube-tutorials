canvasNode.addEventListener('pointerdown', dragStart);
canvasNode.addEventListener('pointerup', dragStop);
canvasNode.addEventListener('pointermove', dragMove);

// canvasNode.addEventListener('mousedown', dragStart);
// canvasNode.addEventListener('mouseup', dragStop);
// canvasNode.addEventListener('mousemove', dragMove);

// canvasNode.addEventListener('touchstart', (e) => {
// 	e.clientX = e.touches[0].clientX;
// 	e.clientY = e.touches[0].clientY;
// 	dragStart(e);
// });

// canvasNode.addEventListener('touchend', (e) => {
// 	e.clientX = e.changedTouches[0].clientX;
// 	e.clientY = e.changedTouches[0].clientY;
// 	dragStop(e);
// });

// canvasNode.addEventListener('touchmove', (e) => {
// 	e.clientX = e.touches[0].clientX;
// 	e.clientY = e.touches[0].clientY;
// 	dragMove(e);
// });
