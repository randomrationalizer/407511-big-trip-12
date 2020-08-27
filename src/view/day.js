import {createShortDate, createElement} from "../util.js";

// Возвращает шаблон блока дня путешествия
const createDayTemplate = (day, dayIndex) => {
  const {date} = day;
  const dayDate = new Date(date);

  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex + 1}</span>
        <time class="day__date" datetime="${date}">${createShortDate(dayDate)}</time>
      </div>
    </li>`;
};

export default class DayView {
  constructor(day, dayIndex) {
    this._dayIndex = dayIndex;
    this._day = day;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._dayIndex);
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
