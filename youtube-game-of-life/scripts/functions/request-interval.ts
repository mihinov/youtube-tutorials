export function requestInterval(fn: () => void, interval: number = 0): {id: number} {
  const obj = {
    id: 0,
  };
  let start = Date.now();

  const animate = () => {
		if (interval === 0) {
			fn();
			obj.id = requestAnimationFrame(animate);
			return;
		}


    const now = Date.now();
    const delta = now - start;

    if (delta >= interval) {
      fn();
      start = now - (delta % interval);
    }

    obj.id = requestAnimationFrame(animate);
  };

  obj.id = requestAnimationFrame(animate);

  return obj;
}
