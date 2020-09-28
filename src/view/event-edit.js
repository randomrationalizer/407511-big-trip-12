import {EVENT_TYPES, TRANSFER_EVENTS} from "../const.js";
import {formatDate, createPreposition, getAvailableOffers, isAnyOffersAvailable} from "../utils/event.js";
import {capitalize} from "../utils/common.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: `bus`,
  destination: ``,
  startDate: null,
  endDate: null,
  price: ``,
  offers: [],
  isFavorite: false
};

// Возвращает шаблон элемента списка типов точки маршрута
const createEventTypeItemTemplates = (types, selectedType) => {
  return `${types.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === selectedType ? `checked` : ``}>
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
const createDestinationTemplate = (cities, destination, type, isDisabled) => {

  return `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${capitalize(type)} ${createPreposition(type)}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ``}" list="destination-list-1" required ${isDisabled ? `disabled` : ``}>
    <datalist id="destination-list-1">
      ${cities.map((city) => `<option value="${city.name}"></option>`).join(``)}
    </datalist>
  </div>`;
};

// Возвращает шаблон блока с описанием пункта назначения
const createCityInfoTemplate = (destination) => {
  const {description, pictures} = destination;

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.length > 0 ? pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(``) : ``}
      </div>
    </div>
  </section>`;
};

// Возвращает шаблон блока выбора даты
const createDateEditTemplate = (start, end, isDisabled) => {

  return `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">
      From
    </label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(start)}" required ${isDisabled ? `disabled` : ``}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">
      To
    </label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(end)}" required ${isDisabled ? `disabled` : ``}>
  </div>`;
};

// Возвращает шаблон блока дополнительных опций точки маршрута
const createOffersTemplate = (availableOffers, type, destination, isDisabled) => {

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">

      ${availableOffers.map((offer, index) => `<div class="event__offer-selector">
        <input data-offer-title="${offer.title}" class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${destination}-${index}" type="checkbox" name="event-offer-${type}-${destination}-${index}" ${offer.isSelected ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
        <label class="event__offer-label" for="event-offer-${type}-${destination}-${index}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join(``)}
    </div>
  </section>`;
};

// Возвращает шаблон формы редактирования/создания точки маршрута
const createEventEditFormTemplate = (destinations, data) => {
  const {
    type,
    destination,
    startDate,
    endDate,
    price,
    isOffersAvailable,
    availableOffers,
    isFavorite,
    isNewEvent,
    isDeleting,
    isDisabled,
    isSaving
  } = data;

  const eventTypeListTemplate = createEventTypeTemplate(type);
  const destinationTemplate = createDestinationTemplate(destinations, destination, type, isDisabled);
  const cityInfoTemplate = destination ? createCityInfoTemplate(destination) : ``;
  const dateTemplate = createDateEditTemplate(startDate, endDate, isDisabled);
  const offersTemplate = isOffersAvailable ? createOffersTemplate(availableOffers, type, destination.name, isDisabled) : ``;

  const isSubmitDisabled = startDate === null || endDate === null;

  return `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

          ${eventTypeListTemplate}
        </div>

        ${destinationTemplate}
        ${dateTemplate}

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``} required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled || isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isNewEvent ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}</button>

        ${!isNewEvent ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isDisabled ? `disabled` : ``} ${isFavorite ? `checked` : ``}>

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
  constructor(tripEvent = BLANK_EVENT, offersModel, destinationsModel) {
    super();
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._offers = this._offersModel.getOffers();
    this._destinations = this._destinationsModel.getDestinations();

    this._data = EventEditView.parseEventToData(this._offers, tripEvent);

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteToggleHandler = this._favoriteToggleHandler.bind(this);
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._setHandlers();
    this._setDatePickers();
  }

  // Преобразует объект точки маршута в объект с данными
  static parseEventToData(allOffers, tripEvent) {
    const availableOffers = getAvailableOffers(allOffers, tripEvent.type);
    const isOffersAvailable = availableOffers.length !== 0;
    const isNewEvent = tripEvent.startDate === null && tripEvent.endDate === null ? true : false;

    return Object.assign(
        {},
        tripEvent,
        {
          isNewEvent,
          isOffersAvailable,
          availableOffers: availableOffers.map((offer) => {
            return Object.assign({}, offer,
                {
                  isSelected: tripEvent.offers.some((tripEventOffer) => tripEventOffer.title === offer.title)
                }
            );
          }),
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  // Преобразует объект с данными в объект точки маршрута
  static parseDataToEvent(data) {
    data = Object.assign({}, data);
    let selectedOffers = [];

    if (data.isOffersAvailable) {
      selectedOffers = data.availableOffers.filter((offer) => offer.isSelected === true).map((selectedOffer) => {
        delete selectedOffer.isSelected;
        return selectedOffer;
      });
    }

    data.offers = selectedOffers;

    delete data.isOffersAvailable;
    delete data.availableOffers;
    delete data.isNewEvent;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  getTemplate() {
    return createEventEditFormTemplate(this._destinations, this._data);
  }

  _resetOffersSelection(eventType) {
    const availableOffers = getAvailableOffers(this._offers, eventType);

    if (availableOffers.length !== 0) {
      availableOffers.forEach((offer) => {
        offer.isSelected = false;
      });
    }

    return availableOffers;
  }

  reset(tripEvent) {
    this.updateData(EventEditView.parseEventToData(this._offers, tripEvent));
  }

  restoreHandlers() {
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);
    this._setHandlers();
    this.setRollupClickHandler(this._callback.rollupClick);
    this._setDatePickers();
  }

  // Удаляет ненужные календари при удалении элемента
  removeElement() {
    super.removeElement();

    this._removeDatePickers();
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
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this.updateData({
      availableOffers: this._data.availableOffers.map((offer) => {
        if (offer.title === evt.target.dataset.offerTitle) {
          offer.isSelected = evt.target.checked;
        }
        return offer;
      })
    }, true);
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset(EventEditView.parseDataToEvent(this._data));
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().addEventListener(`reset`, this._formResetHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const cityName = evt.target.value;
    const cityData = this._destinations.find((destination) => destination.name === cityName);

    if (!cityData) {
      evt.target.setCustomValidity(`Unknown destination. Please check the entered value.`);
      evt.target.reportValidity();
    } else {
      evt.target.setCustomValidity(``);
      evt.target.reportValidity();

      this.updateData({
        destination: cityData
      });
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    const priceValue = parseInt(evt.target.value, 10);
    evt.target.value = priceValue;

    if (priceValue <= 0) {
      evt.target.setCustomValidity(`Incorrect price. You can use numbers greater then zero only.`);
      evt.target.reportValidity();
    } else {
      evt.target.setCustomValidity(``);

      this.updateData({
        price: priceValue
      }, true);
    }
  }

  _eventTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    const eventType = evt.target.value;
    const defaultOffersSelection = this._resetOffersSelection(eventType);

    this.updateData({
      type: eventType,
      isOffersAvailable: isAnyOffersAvailable(this._offers, eventType),
      availableOffers: defaultOffersSelection,
    });
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    if (this._data.isNewEvent) {
      return;
    }

    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  _removeDatePickers() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  _setDatePickers() {
    this._removeDatePickers();

    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          [`time_24hr`]: true,
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler
        }
    );

    this._datepickerEnd = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          [`time_24hr`]: true,
          minDate: this._data.startDate,
          minTime: this._data.startDate,
          defaultDate: this._data.endDate,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(userDates) {
    const selectedDate = userDates[0];
    if (selectedDate > this._datepickerEnd.selectedDates[0]) {
      this.updateData({
        startDate: selectedDate,
        endDate: selectedDate
      }, true);

      this._datepickerEnd.setDate(selectedDate);
    } else {
      this.updateData({startDate: selectedDate}, true);
    }

    this._datepickerEnd.set(`minDate`, selectedDate);
    this._datepickerEnd.set(`minTime`, selectedDate);
  }

  _endDateChangeHandler(userDates) {
    const selectedDate = userDates[0];
    this.updateData({endDate: selectedDate});
  }

  _setHandlers() {
    if (!this._data.isNewEvent) {
      this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteToggleHandler);
    }

    this.getElement().querySelector(`.event__type-group`).addEventListener(`click`, this._eventTypeChangeHandler);

    if (this._data.isOffersAvailable) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._offersChangeHandler);
    }

    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);

    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceInputHandler);
  }
}
