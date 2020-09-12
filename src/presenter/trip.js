import {RenderPosition, render, remove} from "../utils/render.js";
import NoEventsView from "../view/no-events.js";
import DaysListView from "../view/days-list.js";
import SortView from "../view/sort.js";
import EventPresenter from "./event.js";
import DayView from "../view/day.js";
import EventsListView from "../view/events-list.js";
import {SortType} from "../const.js";
import {generateDays} from "../mock/days.js";
import {sortByPrice, sortByTime, sortByDate} from "../utils/event.js";
import {updateItem} from "../utils/common.js";


// Конструктор маршрута путешествия - создаёт, отрисовывает элементы, навешивает обработчики
export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSort = SortType.DEFAULT;
    this._eventPresenter = {};

    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();
    this._daysListComponent = new DaysListView();

    this._handleSortChange = this._handleSortChange.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._sourcedEvents = events.slice().sort(sortByDate);
    this._events = this._sourcedEvents.slice();

    this._sourcedDays = generateDays(this._events);
    this._days = this._sourcedDays.slice();

    this._renderSort();
    this._renderTrip();
  }

  _renderDaysList() {
    render(this._tripContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._tripContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.PRICE_DOWN:
        this._events.sort(sortByPrice);
        this._days = null;
        break;
      case SortType.TIME_DOWN:
        this._events.sort(sortByTime);
        this._days = null;
        break;
      default:
        this._events = this._sourcedEvents.slice();
        this._days = this._sourcedDays.slice();
    }

    this._currentSort = sortType;
  }

  _handleSortChange(sortType) {
    if (sortType === this._currentSort) {
      return;
    }

    this._sortEvents(sortType);
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._handleSortChange);
  }

  // Обновляет моки и вызывает обновление конкретной точки маршрута
  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvents = updateItem(this._sourcedEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  // Сбрасывает у всех презентеров точек маршрута режим отображения на режим по умолчанию
  _handleModeChange() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.resetView());
  }

  // Отрисовывает точку маршрута
  _renderEvent(container, tripEvent) {
    const eventPresenter = new EventPresenter(container, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(tripEvent);
    this._eventPresenter[tripEvent.id] = eventPresenter;
  }

  // Отрисовывает список точек маршрута
  _renderEvents(container, events) {
    const eventsListComponent = new EventsListView();
    render(container, eventsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < events.length; i++) {
      this._renderEvent(eventsListComponent, events[i]);
    }
  }

  // Отрисовывает дни маршрута с событиями
  _renderDays() {
    for (let i = 0; i < this._days.length; i++) {
      const dayComponent = new DayView(this._days[i], i);
      render(this._daysListComponent, dayComponent, RenderPosition.BEFOREEND);
      this._renderEvents(dayComponent, this._days[i].dayEvents);
    }
  }

  _clearTrip() {
    Object.values(this._eventPresenter).forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    remove(this._daysListComponent);
  }

  // Отрисовывает все события и дни маршрута путешествия
  _renderTrip() {
    if (this._events.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderDaysList();

    if (this._days !== null) {
      this._renderDays();
    } else {
      const dayComponent = new DayView();
      render(this._daysListComponent, dayComponent, RenderPosition.BEFOREEND);
      this._renderEvents(dayComponent, this._events);
    }
  }
}
