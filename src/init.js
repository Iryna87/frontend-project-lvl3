// @ts-check

import Example from './Example.js';

export default () => {
  // eslint-disable-next-line no-undef
  const element = document.getElementById('point');
  const obj = new Example(element);
  obj.init();
};
