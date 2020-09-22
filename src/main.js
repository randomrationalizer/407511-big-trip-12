import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistic.js";
import {generateEvent} from "./mock/event.js";
import {RenderPosition, render, remove} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import {EVENT_OFFERS, MenuItem, UpdateType, FilterType} from "./const.js";
import {generateDestinations} from "./mock/destinations.js";

const EVENT_COUNT = 20;

// Генерация случайных точек маршрута
const destinations = generateDestinations();
const tripEvents = new Array(EVENT_COUNT).fill().map(() => generateEvent(destinations));

const eventsModel = new EventsModel();
eventsModel.setEvents(tripEvents);

const filterModel = new FilterModel();

const offersModel = new OffersModel();
offersModel.setOffers(EVENT_OFFERS);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(destinations);


const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
const tripContainerElement = document.querySelector(`.trip-events`);

// Отрисовка меню
const menuComponent = new MenuView();
render(tripControlsFirstHeadingElement, menuComponent, RenderPosition.AFTEREND);

// Отрисовка дней и точек путешествия
const tripPresenter = new TripPresenter(tripContainerElement, eventsModel, offersModel, filterModel, destinationsModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, eventsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);

let statisticsComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripPresenter.destroy();
      menuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      menuComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(tripMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

const handleNewEventFormClose = () => {
  tripMainElement.querySelector(`.trip-main__event-add-btn`).disabled = false;
};

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.createEvent(handleNewEventFormClose);
  menuComponent.setMenuItem(MenuItem.TABLE);
  evt.target.disabled = true;
});

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
