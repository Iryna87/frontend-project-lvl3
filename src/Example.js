// @ts-check
import './style.css';

export default class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = 'Hello, Irina! How are you?';
  }
}
