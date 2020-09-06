import TripInfoView from "./view/trip-info.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import {generateEvent} from "./mock/event.js";
import {generateFilters} from "./mock/filter.js";
import {createTripInfo} from "./mock/trip-info.js";
import {RenderPosition, render} from "./utils/render.js";
import Trip from "./presenter/trip.js";
import {sortByDate} from "./utils/event.js";

const EVENT_COUNT = 20;

// Генерация случайных точек маршрута
const tripEvents = new Array(EVENT_COUNT).fill().map(generateEvent);

// Выбранный фильтр
const filters = generateFilters(tripEvents);
const activeFilter = filters.find((filter) => filter.isActive);
const filteredEvents = activeFilter.filteredEvents;

// Информация о путешествии
const sortedByDateEvents = tripEvents.slice().sort(sortByDate);
const tripInfo = createTripInfo(sortedByDateEvents);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
const tripContainerElement = document.querySelector(`.trip-events`);

// Отрисовка меню
render(tripControlsFirstHeadingElement, new MenuView(), RenderPosition.AFTEREND);

// Отрисовка блока фильтрации точек маршрута
render(tripControlsElement, new FilterView(filters), RenderPosition.BEFOREEND);

// Отрисовка информации о маршруте и стоимости путшествия
render(tripMainElement, new TripInfoView(tripInfo), RenderPosition.AFTERBEGIN);

// Отрисовка дней и точек путешествия
const tripPresenter = new Trip(tripContainerElement);
tripPresenter.init(filteredEvents);
