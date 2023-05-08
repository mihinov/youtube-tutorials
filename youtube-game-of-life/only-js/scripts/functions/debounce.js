export function debounce(func, delay) {
  let timer = null;

  return function (this, ...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(context, args);
      timer = null;
    }, delay);
  };
}
