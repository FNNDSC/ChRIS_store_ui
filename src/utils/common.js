export const debounce = (fn, delay) => {
  let timeout;
  return function execute(...args){
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    }
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  }
}