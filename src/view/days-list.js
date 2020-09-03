import AbstractView from "./abstract.js";

// Возвращает шаблон списка дней путешествия
const createDaysListTemplate = (days) => {
  return `<ul class="trip-days">
      ${days === null ? `<li  class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>` : ``}
    </ul>`;
};

export default class DaysListView extends AbstractView {
  constructor(days) {
    super();
    this._days = days;
  }

  getTemplate() {
    return createDaysListTemplate(this._days);
  }
}
