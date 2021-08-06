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

/**
 * Remove email from author
 * @param {*} authors List or string
 * @returns Just names of plugin authors
 */
export const removeEmail = (authors) => {
  const emailRegex = /(<|\().+?@.{2,}?\..{2,}?(>|\))/g;
  // Match '<' or '(' at the beginning and end
  // Match <string>@<host>.<tld> inside brackets
  if (!Array.isArray(authors))
    // eslint-disable-next-line no-param-reassign
    authors = [ authors ]

  return authors.map((author) => author.replace(emailRegex, "").trim());
}

export default debounce;