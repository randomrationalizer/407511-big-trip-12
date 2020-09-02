import {EVENT_OFFERS, eventTypeToOffers, CITIES, EVENT_TYPES, TRANSFER_EVENTS} from "../const.js";
import {createPreposition} from "../utils/event.js";
import {capitalize} from "../utils/common.js";
import AbstractView from "./abstract.js";

const BLANK_EVENT = {
  type: `bus`,
  destination: ``,
  cityInfo: null,
  startDate: null,
  endDate: null,
  price: ``,
  offers: null,
  isFavorite: false
};

// Возвращает текущую дату
const generateDate = () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0);
  return new Date(currentDate);
};

// Возвращает дату в виде строки в формате: "день/месяц/год часы:минуты"
const humanizeDate = (date) => {
  return date.toLocaleString(`en-GB`, {day: `2-digit`, month: `2-digit`, year: `2-digit`, hour: `2-digit`, minute: `2-digit`}).replace(`,`, ``);
};

// Возвращает шаблон элемента списка типов точки маршрута
const createEventTypeItemTemplates = (types, selectedType) => {
  return `${types.map((type) => `<div class="event__type-item">
    <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === selectedType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${capitalize(type)}</label>
  </div>`).join(``)}`;
};

// Возвращает шаблон списка типов точки маршрута
const createEventTypeTemplate = (selectedType) => {
  const activityEvents = EVENT_TYPES.filter((type) => !TRANSFER_EVENTS.includes(type));

  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>

      ${createEventTypeItemTemplates(TRANSFER_EVENTS, selectedType)}

    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>

      ${createEventTypeItemTemplates(activityEvents, selectedType)}

    </fieldset>
  </div>`;
};

// Возвращает шаблон блока выбора пункта назначения
const createDestinationTemplate = (destination, type) => {

  return `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${capitalize(type)} ${createPreposition(type)}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${CITIES.map((city) => `<option value="${city}"></option>`).join(``)}
    </datalist>
  </div>`;
};

// Возвращает шаблон блока с описанием пункта назначения
const createCityInfoTemplate = (info) => {
  const {description, pics} = info;

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pics.map((pic) => `<img class="event__photo" src="${pic}" alt="Event photo">`).join(``)}
      </div>
    </div>
  </section>`;
};

// Возвращает шаблон блока выбора даты
const createDateEditTemplate = (start, end) => {

  const startDate = start !== null ? humanizeDate(start) : humanizeDate(generateDate());
  const endDate = start !== null ? humanizeDate(end) : humanizeDate(generateDate());

  return `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">
      From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
  </div>`;
};

// Возвращает шаблон блока дополнительных опций точки маршрута
const createOffersTemplate = (type, selectedOffers) => {
  const availableOffers = eventTypeToOffers[type];

  if (availableOffers === null) {
    return ``;
  }

  const allOffers = availableOffers.map((offer) => EVENT_OFFERS.find((elem) => elem.type === offer));

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">

      ${allOffers.map((offer) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}" type="checkbox" name="event-offer-${offer.type}" ${selectedOffers && selectedOffers.some((elem) => elem.type === offer.type) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${offer.type}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join(``)}
    </div>
  </section>`;
};

// Возвращает шаблон формы редактирования/создания точки маршрута
const createEventEditFormTemplate = (tripEvent) => {
  const {type, destination, cityInfo, startDate, endDate, price, offers, isFavorite} = tripEvent;

  const eventTypeListTemplate = createEventTypeTemplate(type);
  const destinationTemplate = createDestinationTemplate(destination, type);
  const dateTemplate = createDateEditTemplate(startDate, endDate);
  const isNewEvent = startDate === null && endDate === null ? true : false;
  const offersTemplate = createOffersTemplate(type, offers);
  const cityInfoTemplate = cityInfo !== null ? createCityInfoTemplate(cityInfo) : ``;

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${eventTypeListTemplate}
        </div>

        ${destinationTemplate}
        ${dateTemplate}

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNewEvent ? `Cancel` : `Delete`}</button>

        ${!isNewEvent ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>

        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ``}

      </header>
      <section class="event__details">
        ${offersTemplate}
        ${cityInfoTemplate}
      </section>
    </form>`;
};

export default class EventEditView extends AbstractView {
  constructor(tripEvent = BLANK_EVENT) {
    super();
    this._event = tripEvent;
  }

  getTemplate() {
    return createEventEditFormTemplate(this._event);
  }
}
