/**
 * Delay a function's execution to happen only after a period of inactivity.
 *
 * @param fn {(function(...[*]): void)|*} callback function to execute after debounce
 * @param delay {Number} time to wait, in milliseconds
 * @return {(function(...[*]): void)|*} given function with debounce delay
 */

export const debounce = (fn, delay = 250) => {
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

export default debounce;