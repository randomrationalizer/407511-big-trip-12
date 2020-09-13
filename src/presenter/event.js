import {RenderPosition, render, replace, remove} from "../utils/render.js";
import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";

// Режим отображения точки маршрута
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};


// Презентер точки маршрута - отвечает за отрисовку точки маршрута и смену её на форму редактирования
export default class Event {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleRollupBtnClick = this._handleRollupBtnClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripEvent) {
    this._event = tripEvent;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(tripEvent);
    this._eventEditComponent = new EventEditView(tripEvent);

    this._eventComponent.setRollupClickHandler(this._handleRollupBtnClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setRollupClickHandler(this._handleRollupBtnClick);

    // первичная инициализация
    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  // Удаляет элементы карточки и формы редактирования
  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    this._changeMode();
    this._mode = Mode.EDITING;
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToEvent() {
    this._eventEditComponent.reset(this._event);
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  // Обработчик отправки формы
  _handleFormSubmit(tripEvent) {
    this._changeData(tripEvent);
    this._replaceFormToEvent();
  }

  // Обработчик открытия / скрытия формы редактирования
  _handleRollupBtnClick() {
    if (this._mode === Mode.DEFAULT) {
      this._replaceEventToForm();
    } else {

      this._replaceFormToEvent();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }
}
