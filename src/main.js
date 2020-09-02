import TripInfoView from "./view/trip-info.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import DaysListView from "./view/days-list.js";
import DayView from "./view/day.js";
import EventsListView from "./view/events-list.js";
import EventView from "./view/event.js";
import EventEditView from "./view/event-edit.js";
import {generateEvent} from "./mock/event.js";
import NoEventsView from "./view/no-events.js";
import {generateFilters} from "./mock/filter.js";
import {generateSort} from "./mock/sort.js";
import {generateDays} from "./mock/days.js";
import {createTripInfo} from "./mock/trip-info.js";
import {SORT_BY_DEFAULT} from "./const.js";
import {RenderPosition, render, replace} from "./utils/render.js";

const EVENT_COUNT = 10;

// Генерация случайных точек маршрута
const tripEvents = new Array(EVENT_COUNT).fill().map(generateEvent);

// Выбранный способ сортировки
const sort = generateSort(tripEvents);
const activeSort = sort.find((sortItem) => sortItem.isActive);
const sortedEvents = activeSort.sortedEvents;

// Выбранный фильтр
const filters = generateFilters(sortedEvents);
const activeFilter = filters.find((filter) => filter.isActive);
const filteredEvents = activeFilter.filteredEvents;

// Массив дней маршрута
const days = activeSort.name === SORT_BY_DEFAULT ? generateDays(filteredEvents) : null;

// Информация о путешествии
const sortedByDateEvents = sort.find((sortItem) => sortItem.name === SORT_BY_DEFAULT).sortedEvents;
const tripInfo = createTripInfo(sortedByDateEvents);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
const tripEventsContainerElement = document.querySelector(`.trip-events`);

// Отрисовывает точку маршрута
const renderEvent = (eventsListElement, tripEvent) => {
  const eventComponent = new EventView(tripEvent);
  const eventEditComponent = new EventEditView(tripEvent);

  render(eventsListElement, eventComponent, RenderPosition.BEFOREEND);

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

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });
};

// Отрисовывает точки маршрута и дни путешествия
const renderTrip = (tripContainer, tripDays, tripPoints) => {

  // В случае отсутствия точек маршрута, вместо списка отображается заглушка
  if (tripPoints.length === 0) {
    render(tripContainer, new NoEventsView(), RenderPosition.BEFOREEND);
    return;
  }

  const daysListComponent = new DaysListView(tripDays);

  // Отрисовка сортировки
  render(tripContainer, new SortView(sort), RenderPosition.BEFOREEND);

  // Отрисовка списка дней
  render(tripContainer, daysListComponent, RenderPosition.BEFOREEND);

  // Отрисовывает список точек маршрута
  const renderEventsList = (eventsContainer, events) => {
    const eventsListComponent = new EventsListView();
    render(eventsContainer, eventsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < events.length; i++) {
      renderEvent(eventsListComponent, events[i]);
    }
  };

  // Отрисовывает точки событий с разбивкой по дням
  const renderEventsByDays = (eventsContainer, daysOfTrip) => {
    for (let i = 0; i < daysOfTrip.length; i++) {
      const dayComponent = new DayView(daysOfTrip[i], i);
      render(eventsContainer, dayComponent, RenderPosition.BEFOREEND);
      renderEventsList(dayComponent, daysOfTrip[i].dayEvents);
    }
  };

  if (tripDays !== null) {
    renderEventsByDays(daysListComponent, tripDays);
  } else {
    renderEventsList(daysListComponent, tripPoints);
  }
};

// Отрисовка меню
render(tripControlsFirstHeadingElement, new MenuView(), RenderPosition.AFTEREND);

// Отрисовка блока фильтрации точек маршрута
render(tripControlsElement, new FilterView(filters), RenderPosition.BEFOREEND);

// Отрисовка информации о маршруте и стоимости путшествия
render(tripMainElement, new TripInfoView(tripInfo), RenderPosition.AFTERBEGIN);

// Отрисовка дней и точек путешествия
renderTrip(tripEventsContainerElement, days, filteredEvents);
