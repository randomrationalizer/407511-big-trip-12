import {EVENT_OFFERS, CITIES, EVENT_TYPES, TRANSFER_EVENTS} from "../const.js";
import {createPreposition, isAnyOffersAvailable, getAvailableOffers} from "../utils/event.js";
import {capitalize} from "../utils/common.js";
import SmartView from "./smart.js";
import {generateCityInfo} from "../mock/event.js"; // временно

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
const createOffersTemplate = (availableOffers, selection) => {

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">

      ${availableOffers.map((offer) => `<div class="event__offer-selector">
        <input data-offer-type="${offer.type}" class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}" type="checkbox" name="event-offer-${offer.type}" ${selection[offer.type] ? `checked` : ``}>
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
const createEventEditFormTemplate = (data) => {
  const {type, destination, cityInfo, startDate, endDate, price, isOffersAvailable, allOffers, offersSelection, isFavorite} = data;

  const eventTypeListTemplate = createEventTypeTemplate(type);
  const destinationTemplate = createDestinationTemplate(destination, type);
  const dateTemplate = createDateEditTemplate(startDate, endDate);
  const isNewEvent = startDate === null && endDate === null ? true : false;
  const offersTemplate = isOffersAvailable ? createOffersTemplate(allOffers, offersSelection) : ``;

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

export default class EventEditView extends SmartView {
  constructor(tripEvent = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(tripEvent);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._setHandlers();
  }

  // Преобразует объект точки маршута в объект с данными
  static parseEventToData(tripEvent) {
    const availableOffers = getAvailableOffers(tripEvent.type);
    let offersSelection = {};

    if (availableOffers !== null) {
      if (tripEvent.offers !== null) {
        availableOffers.forEach((offer) => {
          const isSelected = tripEvent.offers.some((tripEventOffer) => tripEventOffer.type === offer.type);
          offersSelection[offer.type] = isSelected;
        });
      } else {
        availableOffers.forEach((offer) => {
          offersSelection[offer.type] = false;
        });
      }
    }

    return Object.assign({}, tripEvent, {isOffersAvailable: availableOffers !== null, allOffers: availableOffers, offersSelection});
  }

  // Преобразует объект с данными в объект точки маршрута
  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    let selectedOffers = [];

    if (data.isOffersAvailable) {
      const availableOffers = Object.keys(data.offersSelection);

      for (const offer of availableOffers) {
        if (data.offersSelection[offer] === true) {
          const offerData = EVENT_OFFERS.find((elem) => elem.type === offer);
          selectedOffers.push(offerData);
        }
      }
    }

    data.offers = selectedOffers.length !== 0 ? selectedOffers : null;

    delete data.isOffersAvailable;
    delete data.allOffers;
    delete data.offersSelection;

    return data;
  }

  getTemplate() {
    return createEventEditFormTemplate(this._data);
  }

  static resetOffersSelection(eventType) {
    const availableOffers = getAvailableOffers(eventType);
    let selection = {};
    if (availableOffers !== null) {
      availableOffers.forEach((offer) => {
        selection[offer.type] = false;
      });
    }

    return selection;
  }

  reset(tripEvent) {
    this.updateData(EventEditView.parseEventToData(tripEvent));
  }

  restoreHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this._setHandlers();
    this.setRollupClickHandler(this._callback.rollupClick);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseDataToEvent(this._data));
  }

  _favoriteToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({isFavorite: !this._data.isFavorite});
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      offersSelection: Object.assign(
          {},
          this._data.offersSelection,
          {[evt.target.dataset.offerType]: evt.target.checked}
      )});
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
      cityInfo: generateCityInfo()
    });
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    const eventType = evt.target.textContent.toLowerCase();
    this.updateData({
      type: eventType,
      isOffersAvailable: isAnyOffersAvailable(eventType),
      allOffers: getAvailableOffers(eventType),
      offersSelection: EventEditView.resetOffersSelection(eventType)
    });
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  _setHandlers() {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteToggleHandler);
    this.getElement().querySelector(`.event__type-group`).addEventListener(`click`, this._eventTypeChangeHandler);

    if (this._data.isOffersAvailable) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._offersChangeHandler);
    }

    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationInputHandler);
  }
}
