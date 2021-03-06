import {RenderPosition, render, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import NoEventsView from "../view/no-events.js";
import DaysListView from "../view/days-list.js";
import SortView from "../view/sort.js";
import EventPresenter, {State as EventPresenterViewState} from "./event.js";
import DayView from "../view/day.js";
import EventsListView from "../view/events-list.js";
import {SortType, UserAction, UpdateType} from "../const.js";
import {sortByPrice, sortByTime, sortByDate, formatDateWithoutTime} from "../utils/event.js";
import EventNewPresenter from "./event-new.js";
import LoadingView from "../view/loading.js";


// Конструктор маршрута путешествия - создаёт, отрисовывает элементы, навешивает обработчики
export default class Trip {
  constructor(tripContainer, eventsModel, offersModel, filterModel, destinationsModel, api) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._currentSort = SortType.DEFAULT;
    this._eventPresenter = {};
    this._sortComponent = null;
    this._isLoading = true;
    this._api = api;

    this._noEventsComponent = new NoEventsView();
    this._daysListComponent = new DaysListView();
    this._loadingMsgComponent = new LoadingView();

    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._tripContainer, this._handleViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  _renderDaysList() {
    render(this._tripContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._tripContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadingMsg() {
    render(this._tripContainer, this._loadingMsgComponent, RenderPosition.BEFOREEND);
  }

  _handleSortChange(sortType) {
    if (sortType === this._currentSort) {
      return;
    }

    this._currentSort = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSort);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  // по умолчанию события отсортированы в хронологическом порядке
  _getEvents() {
    const activeFilter = this._filterModel.getFilter();
    const tripEvents = this._eventsModel.getEvents();
    const filteredEvents = filter[activeFilter](tripEvents);

    switch (this._currentSort) {
      case SortType.PRICE_DOWN:
        return filteredEvents.sort(sortByPrice);
      case SortType.TIME_DOWN:
        return filteredEvents.sort(sortByTime);
    }

    return filteredEvents.sort(sortByDate);
  }

  // Обработчик изменений в представлении, вызывает обновление модели
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_TO_FAVORITE:
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          }).catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          }).catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
    }
  }

  // Обработчик изменений в модели, вызывает обновление представления
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.POINTWISE:
        this._eventPresenter[data.id].updateForm(data);
        break;
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingMsgComponent);
        this._renderTrip();
        break;
    }
  }

  // Сбрасывает у всех презентеров точек маршрута режим отображения на режим по умолчанию
  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  createEvent(callback) {
    if (this._eventsModel.getEvents().length === 0) {
      remove(this._noEventsComponent);
    }

    this._eventNewPresenter.init(callback);
  }

  // Отрисовывает точку маршрута
  _renderEvent(container, tripEvent) {
    const eventPresenter = new EventPresenter(container, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);
    eventPresenter.init(tripEvent);
    this._eventPresenter[tripEvent.id] = eventPresenter;
  }

  // Отрисовывает список точек маршрута
  _renderEvents(container, events) {
    const eventsListComponent = new EventsListView();
    render(container, eventsListComponent, RenderPosition.BEFOREEND);

    events.forEach((tripEvent) => this._renderEvent(eventsListComponent, tripEvent));
  }

  // Возвращает данные дней путешествия
  _generateDays(tripEvents) {
    const dates = tripEvents.map((tripEvent) => formatDateWithoutTime(tripEvent.startDate));
    const uniqueDates = [...new Set(dates)];

    return uniqueDates.map((date) => {
      const matchEvents = tripEvents.filter((tripEvent) => formatDateWithoutTime(tripEvent.startDate) === date);

      return {
        date,
        dayEvents: matchEvents
      };
    });
  }

  // Отрисовывает дни маршрута с событиями
  _renderDays() {
    for (let i = 0; i < this._days.length; i++) {
      const dayComponent = new DayView(this._days[i], i);
      render(this._daysListComponent, dayComponent, RenderPosition.BEFOREEND);
      this._renderEvents(dayComponent, this._days[i].dayEvents);
    }
  }

  // Сбрасывает представление списка точек маршрута, сортировки
  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._daysListComponent);
    remove(this._sortComponent);
    remove(this._noEventsComponent);
    remove(this._loadingMsgComponent);

    if (resetSortType) {
      this._currentSort = SortType.DEFAULT;
    }
  }

  destroy() {
    this._clearTrip({resetSortType: true});
    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  // Отрисовывает все события и дни маршрута путешествия
  _renderTrip() {
    if (this._isLoading) {
      this._renderLoadingMsg();
      return;
    }

    const events = this._getEvents();
    if (events.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderSort();
    this._days = this._generateDays(events);
    this._renderDaysList();

    if (this._currentSort === SortType.DEFAULT) {
      this._renderDays();
    } else {
      const dayComponent = new DayView();
      render(this._daysListComponent, dayComponent, RenderPosition.BEFOREEND);
      this._renderEvents(dayComponent, events);
    }
  }
}
