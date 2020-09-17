import TripInfoView from "./view/trip-info.js";
import MenuView from "./view/menu.js";

import {generateEvent} from "./mock/event.js";
import {createTripInfo} from "./mock/trip-info.js";
import {RenderPosition, render} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import {sortByDate} from "./utils/event.js";
import EventsModel from "./model/events.js";
import OffersModel from "./model/offers.js";
import FilterModel from "./model/filter.js";
import {EVENT_OFFERS} from "./const.js";

const EVENT_COUNT = 20;

// Генерация случайных точек маршрута
const tripEvents = new Array(EVENT_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(tripEvents);

const filterModel = new FilterModel();

const offersModel = new OffersModel();
offersModel.setOffers(EVENT_OFFERS);


// Информация о путешествии
const sortedByDateEvents = tripEvents.slice().sort(sortByDate);
const tripInfo = createTripInfo(sortedByDateEvents);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
const tripContainerElement = document.querySelector(`.trip-events`);

// Отрисовка меню
render(tripControlsFirstHeadingElement, new MenuView(), RenderPosition.AFTEREND);

// Отрисовка информации о маршруте и стоимости путшествия
render(tripMainElement, new TripInfoView(tripInfo), RenderPosition.AFTERBEGIN);

// Отрисовка дней и точек путешествия
const tripPresenter = new TripPresenter(tripContainerElement, eventsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);

filterPresenter.init();
tripPresenter.init();


// Доделать историю с офферами
// изменение цены точки маршрута
// изменение общей инфо о путешествии - маршрут и итоговая стоимость. Презентер инфо????
// создание новой точки
