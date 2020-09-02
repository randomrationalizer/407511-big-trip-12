import {createShortDate} from "../util.js";
import AbstractView from "./abstract.js";

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

export default class DayView extends AbstractView {
  constructor(day, dayIndex) {
    super();
    this._dayIndex = dayIndex;
    this._day = day;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._dayIndex);
  }
}
