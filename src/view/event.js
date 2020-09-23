import {formatDateToIso, formatTime, getFormatedDuration, createPreposition} from "../utils/event.js";
import {capitalize} from "../utils/common.js";
import AbstractView from "./abstract.js";


// Возвращает шаблон дополнительных опций точки маршрута
const createOffersTemplate = (offers) => {

  return `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">

      ${offers.map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`).join(``)}
    </ul>`;
};

// Возвращает шаблон точки маршрута
const createEventTemplate = (tripEvent) => {
  const {type, destination, startDate, endDate, price, offers} = tripEvent;
  const offersTemplate = offers ? createOffersTemplate(offers) : ``;

  return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalize(type)} ${createPreposition(type)} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateToIso(startDate)}">${formatTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateToIso(endDate)}">${formatTime(endDate)}</time>
          </p>
          <p class="event__duration">${getFormatedDuration(startDate, endDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        ${offersTemplate}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class EventView extends AbstractView {
  constructor(tripEvent) {
    super();
    this._event = tripEvent;
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }
}
