import {createElement} from "../util.js";

// Возвращает шаблон списка дней путешествия
const createDaysListTemplate = (days) => {
  return `<ul class="trip-days">
      ${days === null ? `<li  class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>` : ``}
    </ul>`;
};

export default class DaysListView {
  constructor(days) {
    this._days = days;
    this._element = null;
  }

  getTemplate() {
    return createDaysListTemplate(this._days);
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
