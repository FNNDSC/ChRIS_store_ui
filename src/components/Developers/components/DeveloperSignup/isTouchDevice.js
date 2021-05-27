/* inspired by https://github.com/Modernizr/Modernizr/blob/v3/feature-detects/touchevents.js */
const isTouchDevice = () => {
  if (('ontouchstart') in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
    return true;
  }

  if (window.matchMedia) {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return window.matchMedia(query).matches;
  }

  return false;
};

export default isTouchDevice