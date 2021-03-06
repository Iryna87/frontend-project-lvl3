// @ts-check

import Example from './Example.js';

export default () => {
  const element = document.querySelector('button');
  const obj = new Example(element);
  obj.init();
};
