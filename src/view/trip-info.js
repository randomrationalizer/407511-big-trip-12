import {createShortDate, createElement} from "../util.js";

// Возвращает шаблон блока маршрута путешествия
const createRouteTemplate = (route) => {
  const first = route[0];
  let last = route.length === 1 ? `` : route[route.length - 1];
  let middle = ``;

  switch (route.length) {
    case 1:
      middle = ``;
      break;
    case 2:
      middle = first !== last ? ` &mdash; ` : ``;
      break;
    case 3:
      middle = route[1] !== first && route[1] !== last ? ` &mdash; ${route[1]} &mdash; ` : ` &mdash; `;
      break;
    default:
      middle = ` &mdash; ... &mdash; `;
  }

  const isSameCity = new Set(route).size === 1 ? true : false;

  return `<h1 class="trip-info__title">${!isSameCity ? `${first}${middle}${last}` : `${first}`}</h1>`;
};

// Возвращает шаблон блока дат путешествия
const createDatesTemplate = (startDate, endDate) => {
  const isSameMonth = startDate.getMonth() === endDate.getMonth();
  const start = createShortDate(startDate);
  const end = createShortDate(endDate);

  return `<p class="trip-info__dates">${start}&nbsp;&mdash;&nbsp;${isSameMonth ? end.slice(4) : end}</p>`;
};


// Возвращает шаблон блока информации о маршруте
const createTripInfoTemplate = (tripInfo) => {
  const {route, startDate, endDate, cost} = tripInfo;
  const datesTemplate = createDatesTemplate(startDate, endDate);
  const routeTemplate = createRouteTemplate(route);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${routeTemplate}
      ${datesTemplate}
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
};

export default class TripInfoView {
  constructor(tripInfo) {
    this._info = tripInfo;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
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
