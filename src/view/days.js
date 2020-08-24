import {createShortDate} from "../util.js";

// Возвращает шаблон блока дня путешествия
const createDayTemplate = (day, dayIndex) => {
  const {date} = day;
  const dayDate = new Date(date);

  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex + 1}</span>
        <time class="day__date" datetime="${date}">${createShortDate(dayDate)}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`;
};

// Возвращает шаблон списка дней путешествия
export const createDaysListTemplate = (days) => {
  return `<ul class="trip-days">
      ${days !== null ? `${days.map((day, index) => createDayTemplate(day, index)).join(``)}` : `<li  class="trip-days__item  day">
        <div class="day__info"></div>
        <ul class="trip-events__list"></ul>
      </li>`}
    </ul>`;
};
