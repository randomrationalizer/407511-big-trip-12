import TripInfoView from "./view/trip-info.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import {generateEvent} from "./mock/event.js";
import {generateFilters} from "./mock/filter.js";
import {generateSort} from "./mock/sort.js";
import {createTripInfo} from "./mock/trip-info.js";
import {SORT_BY_DEFAULT} from "./const.js";
import {RenderPosition, render} from "./utils/render.js";
import Trip from "./presenter/trip.js";

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

// Информация о путешествии
const sortedByDateEvents = sort.find((sortItem) => sortItem.name === SORT_BY_DEFAULT).sortedEvents;
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
tripPresenter.init(filteredEvents, sort);
