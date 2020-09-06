import {RenderPosition, render, replace, remove} from "../utils/render.js";
import NoEventsView from "../view/no-events.js";
import DaysListView from "../view/days-list.js";
import SortView from "../view/sort.js";
import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";
import DayView from "../view/day.js";
import EventsListView from "../view/events-list.js";
import {SortType} from "../const.js";
import {generateDays} from "../mock/days.js";
import {sortByPrice, sortByTime, sortByDate} from "../utils/event.js";


// Конструктор маршрута путешествия - создаёт, отрисовывает элементы, навешивает обработчики
export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = new SortView();
    this._currentSort = SortType.DEFAULT;
    this._daysListComponent = new DaysListView();
    this._handleSortChange = this._handleSortChange.bind(this);
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

  // Отрисовывает точку маршрута
  _renderEvent(container, tripEvent) {
    const eventComponent = new EventView(tripEvent);
    const eventEditComponent = new EventEditView(tripEvent);

    render(container, eventComponent, RenderPosition.BEFOREEND);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replaceEventToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventEditComponent);
    };

    eventComponent.setRollupClickHandler(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
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
