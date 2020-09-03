import {RenderPosition, render, replace} from "../utils/render.js";
import NoEventsView from "../view/no-events.js";
import DaysListView from "../view/days-list.js";
import SortView from "../view/sort.js";
import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";
import DayView from "../view/day.js";
import EventsListView from "../view/events-list.js";
import {SORT_BY_DEFAULT} from "../const.js";
import {generateDays} from "../mock/days.js";


// Конструктор маршрута путешествия - создаёт, отрисовывает элементы, навешивает обработчики
export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._noEventsComponent = new NoEventsView();
  }

  init(events, sort) {
    this._events = events.slice();
    this._sort = sort.slice();
    this._getDays();
    this._renderSort();
    this._renderTrip();
  }

  // Получает массив дней маршрута
  _getDays() {
    const activeSort = this._sort.find((sortItem) => sortItem.isActive);
    this._days = activeSort.name === SORT_BY_DEFAULT ? generateDays(this._events) : null;
  }

  _renderDaysList() {
    this._daysListComponent = new DaysListView(this._days);
    render(this._tripContainer, this._daysListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoEvents() {
    render(this._tripContainer, this._noEventsComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    const sortComponent = new SortView(this._sort);
    render(this._tripContainer, sortComponent, RenderPosition.BEFOREEND);
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
      this._renderEvents(this._daysListComponent, this._events);
    }
  }
}
