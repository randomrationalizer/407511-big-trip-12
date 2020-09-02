import {createElement} from "../util.js";

// Абстрактный класс, от которого наследуются компоненты
export default class Abstract {
  constructor() {
    // нельзя создать экземпляр абстрактного класса
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract class, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    // чтобы не забыть прописать метод получения шаблона в компонентах
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
