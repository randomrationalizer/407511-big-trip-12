import {RenderPosition, render, remove} from "../utils/render.js";
import EventEditView from "../view/event-edit.js";
import {UserAction, UpdateType} from "../const.js";
import {generateId} from "../utils/event.js";

const BLANK_EVENT = {
  type: `bus`,
  destination: ``,
  startDate: null,
  endDate: null,
  price: ``,
  offers: [],
  isFavorite: false
};


// Презентер формы создания новой точки маршрута
export default class EventNew {
  constructor(daysListContainer, changeData, offersModel, destinationsModel) {
    this._daysListContainer = daysListContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventEditComponent = null;

    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormReset = this._handleFormReset.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EventEditView(BLANK_EVENT, this._offersModel, this._destinationsModel);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFormResetHandler(this._handleFormReset);

    render(this._daysListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(tripEvent) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        // задаёт id новой точке маршрута
        Object.assign({id: generateId()}, tripEvent)
    );
    this.destroy();
  }

  _handleFormReset() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
