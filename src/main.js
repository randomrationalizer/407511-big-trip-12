import {createTripInfoTemplate} from "./view/trip-info.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createEventSortTemplate} from "./view/sort.js";
import {createDaysListTemplate} from "./view/days.js";
import {createEventTemplate} from "./view/event.js";
import {createEventEditFormTemplate} from "./view/event-edit.js";
import {generateEvent} from "./mock/event.js";
import {generateFilters} from "./mock/filter.js";
import {generateSort} from "./mock/sort.js";
import {generateDays} from "./mock/days.js";
import {createTripInfo} from "./mock/trip-info.js";
import {SORT_BY_DEFAULT} from "./const.js";

const EVENT_COUNT = 5;

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


// Отрисовывает элемент на странице
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Отрисовывает точки маршрута путешествия, в зависимости от выбранного типа представления
const renderTrip = (tripDays, events) => {
  if (tripDays !== null) {
    renderEventsByDays(tripDays);
  } else {
    renderEventsAsList(events);
  }
};

// Отрисовывает точки событий по умолчанию - с разбивкой по дням
const renderEventsByDays = (tripDays) => {
  const tripDaysElements = Array.from(tripDaysListElement.querySelectorAll(`.day`));

  tripDaysElements.forEach((dayElement, index) => {
    const currentDayEvents = tripDays[index].dayEvents;
    renderEvents(dayElement, currentDayEvents);
  });
};

// Отрисовывает точки маршрута списком без разбивки по дням
const renderEventsAsList = (events) => {
  const tripDayElement = tripDaysListElement.querySelector(`.day`);
  renderEvents(tripDayElement, events);
};

// Отрисовывает точки маршрута
const renderEvents = (day, events) => {
  const eventsListElement = day.querySelector(`.trip-events__list`);

  for (let i = 0; i < events.length; i++) {
    render(eventsListElement, createEventTemplate(events[i]), `beforeend`);
  }
};


// Отрисовка информации о маршруте и стоимости путшествия
const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(tripInfo), `afterbegin`);
// const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
// render(tripInfoElement, createTripCostTemplate(), `beforeend`);

// Отрисовка меню
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
render(tripControlsFirstHeadingElement, createMenuTemplate(), `afterend`);

// Отрисовка блока фильтрации точек маршрута
render(tripControlsElement, createFilterTemplate(filters), `beforeend`);

const tripEventsContainerElement = document.querySelector(`.trip-events`);

// Отрисовка блока сортировки точек маршрута
const tripEventsHeadingElement = tripEventsContainerElement.querySelector(`h2`);
render(tripEventsHeadingElement, createEventSortTemplate(sort), `afterend`);

// Отрисовка списка дней путешествия
render(tripEventsContainerElement, createDaysListTemplate(days), `beforeend`);
const tripDaysListElement = tripEventsContainerElement.querySelector(`.trip-days`);

// Отрисовка точек маршрута
renderTrip(days, filteredEvents);

// Отрисовка формы редактирования/создания точки маршрута
const firstEventElement = tripDaysListElement.querySelector(`.trip-events__item`);
firstEventElement.innerHTML = ``;
render(firstEventElement, createEventEditFormTemplate(filteredEvents[0]), `afterbegin`);
