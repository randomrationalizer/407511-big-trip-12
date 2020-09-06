import {createShortDate} from "../utils/event.js";
import AbstractView from "./abstract.js";

const createDayInfoTemplate = (day, dayIndex) => {
  const dayDate = new Date(day.date);

  return `<span class="day__counter">${dayIndex + 1}</span>
  <time class="day__date" datetime="${day.date}">${createShortDate(dayDate)}</time>`;
};

// Возвращает шаблон блока дня путешествия
const createDayTemplate = (day, dayIndex) => {
  const dayInfoTemplate = day === undefined || dayIndex === undefined ? `` : createDayInfoTemplate(day, dayIndex);

  return `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoTemplate}
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
