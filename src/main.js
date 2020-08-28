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
import {RenderPosition, render} from "./util.js";

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

// Иформация о путешествии
const sortedByDateEvents = sort.find((sortItem) => sortItem.name === SORT_BY_DEFAULT).sortedEvents;
const tripInfo = createTripInfo(sortedByDateEvents);


// Отрисовывает точку маршрута
const renderEvent = (eventsListElement, tripEvent) => {
  const eventComponent = new EventView(tripEvent);
  const eventEditComponent = new EventEditView(tripEvent);

  render(eventsListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEventToForm = () => {
    eventsListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventsListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
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

// Отрисовывает список точек маршрута
const renderEventsList = (container, events) => {
  const eventsListComponent = new EventsListView();
  render(container, eventsListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < events.length; i++) {
    renderEvent(eventsListComponent.getElement(), events[i]);
  }
};

// Отрисовывает точки событий по умолчанию - с разбивкой по дням
const renderEventsByDays = (container, tripDays) => {
  for (let i = 0; i < tripDays.length; i++) {
    const dayComponent = new DayView(tripDays[i], i);
    render(container, dayComponent.getElement(), RenderPosition.BEFOREEND);
    renderEventsList(dayComponent.getElement(), tripDays[i].dayEvents);
  }
};

// Отрисовывает точки маршрута путешествия в зависимости от выбранного типа представления
const renderTrip = (tripDays, events) => {
  const daysListComponent = new DaysListView(tripDays);
  render(tripEventsContainerElement, daysListComponent.getElement(), RenderPosition.BEFOREEND);

  if (tripDays !== null) {
    renderEventsByDays(daysListComponent.getElement(), tripDays);
  } else {
    renderEventsList(daysListComponent.getElement(), events);
  }
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);

// Отрисовка меню
render(tripControlsFirstHeadingElement, new MenuView().getElement(), RenderPosition.AFTEREND);

// Отрисовка блока фильтрации точек маршрута
render(tripControlsElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

// Отрисовка информации о маршруте и стоимости путшествия
render(tripMainElement, new TripInfoView(tripInfo).getElement(), RenderPosition.AFTERBEGIN);

const tripEventsContainerElement = document.querySelector(`.trip-events`);

// Отрисовка точек маршрута. В случае отсутствия точек маршрута, вместо списка отображается заглушка: «Click New Event to create your first point»
if (tripEvents.length === 0) {
  render(tripEventsContainerElement, new NoEventsView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripEventsContainerElement, new SortView(sort).getElement(), RenderPosition.BEFOREEND);
  renderTrip(days, filteredEvents);
}
