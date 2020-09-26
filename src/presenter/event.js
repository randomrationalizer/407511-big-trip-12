import {RenderPosition, render, replace, remove} from "../utils/render.js";
import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual} from "../utils/event.js";

// Режим отображения точки маршрута
const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};


// Презентер точки маршрута - отвечает за отрисовку точки маршрута и смену её на форму редактирования
export default class Event {
  constructor(eventListContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._eventListContainer = eventListContainer;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleRollupBtnClick = this._handleRollupBtnClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormReset = this._handleFormReset.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripEvent) {
    this._event = tripEvent;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(tripEvent);
    this._eventEditComponent = new EventEditView(tripEvent, this._offersModel, this._destinationsModel);

    this._eventComponent.setRollupClickHandler(this._handleRollupBtnClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFormResetHandler(this._handleFormReset);
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
      replace(this._eventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  // Удаляет элементы карточки и формы редактирования
  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.ABORTING:
        this._eventEditComponent.shake(resetFormState);
        break;
    }
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
  _handleFormSubmit(updatedEvent) {
    const isMinorUpdate = !isDatesEqual(this._event, updatedEvent) || updatedEvent.price === this._event.price;


    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        updatedEvent
    );
  }

  _handleFormReset(tripEvent) {
    this._changeData(UserAction.DELETE_EVENT, UpdateType.MINOR, tripEvent);
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
