import {createTripInfoTemplate} from "./view/trinp-info.js";
import {createTripCostTemplate} from "./view/trinp-cost.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createEventSortTemplate} from "./view/sort.js";
import {createDaysListTemplate} from "./view/days-list.js";
import {createDayTemplate} from "./view/day.js";
import {createEventTemplate} from "./view/event.js";
import {createEventEditFormTemplate} from "./view/event-edit.js";

const EVENT_COUNT = 3;

// Отрисовывает элемент на странице
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Отрисовыет N точек маршрута
const renderEvents = (count) => {
  const eventListElement = tripDayElement.querySelector(`.trip-events__list`);

  for (let i = 0; i < count; i++) {
    render(eventListElement, createEventTemplate(), `afterbegin`);
  }
};

const tripMainElement = document.querySelector(`.trip-main`);

// Отрисовка информации о путшествии
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(), `beforeend`);

// Отрисовка меню
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
render(tripControlsFirstHeadingElement, createMenuTemplate(), `afterend`);

// Отрисовка блока фильтрации точек маршрута
render(tripControlsElement, createFilterTemplate(), `beforeend`);

const tripEventsContainerElement = document.querySelector(`.trip-events`);

// Отрисовка блока сортировки точек маршрута
const tripEventsHeadingElement = tripEventsContainerElement.querySelector(`h2`);
render(tripEventsHeadingElement, createEventSortTemplate(), `afterend`);

// Отрисовка блока дня путешествия
render(tripEventsContainerElement, createDaysListTemplate(), `beforeend`);
const tripDaysListElement = tripEventsContainerElement.querySelector(`.trip-days`);
render(tripDaysListElement, createDayTemplate(), `afterbegin`);

// Отрисовка 3х точек маршрута
const tripDayElement = tripDaysListElement.querySelector(`.day`);
renderEvents(EVENT_COUNT);

// Отрисовка формы редактирования/создания точки маршрута
const tripEventsSortElement = tripEventsContainerElement.querySelector(`.trip-sort`);
render(tripEventsSortElement, createEventEditFormTemplate(), `afterend`);
