import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistic.js";
import {RenderPosition, render, remove} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripInfoPresenter from "./presenter/trip-info.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";

import Api from "./api.js";

const AUTHORIZATION = `Basic d2fsafsfafa5852ca`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
const tripContainerElement = document.querySelector(`.trip-events`);
const newEventBtnElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const menuComponent = new MenuView();

const tripPresenter = new TripPresenter(tripContainerElement, eventsModel, offersModel, filterModel, destinationsModel, api);
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

const handleNewEventFormClose = () => {
  newEventBtnElement.disabled = false;
};

newEventBtnElement.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.createEvent(handleNewEventFormClose);
  menuComponent.setMenuItem(MenuItem.TABLE);
  evt.target.disabled = true;
});

newEventBtnElement.disabled = true;
tripInfoPresenter.init();
tripPresenter.init();


api.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
    api.getOffers().
      then((offers) => {
        offersModel.setOffers(offers);
        api.getEvents()
          .then((tripEvents) => {
            eventsModel.setEvents(UpdateType.INIT, tripEvents);
          })
          .catch(() => {
            eventsModel.setEvents(UpdateType.INIT, []);
          })
          .finally(() => {
            render(tripControlsFirstHeadingElement, menuComponent, RenderPosition.AFTEREND);
            menuComponent.setMenuClickHandler(handleMenuClick);
            filterPresenter.init();
            newEventBtnElement.disabled = false;
          });
      });
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    newEventBtnElement.disabled = true;
  });
