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

import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const DataType = {
  EVENTS: `events`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`
};

const AUTHORIZATION = `Basic d2fb2sa68sv5v9`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v12`;
const EVENTS_STORE_NAME = `${STORE_PREFIX}-${DataType.EVENTS}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${STORE_PREFIX}-${DataType.DESTINATIONS}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${STORE_PREFIX}-${DataType.OFFERS}-${STORE_VER}`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripControlsFirstHeadingElement = tripControlsElement.querySelector(`h2`);
const tripContainerElement = document.querySelector(`.trip-events`);
const newEventBtnElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const api = new Api(END_POINT, AUTHORIZATION);
const eventsStore = new Store(EVENTS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, eventsStore, destinationsStore, offersStore, eventsModel);


const menuComponent = new MenuView();
let statisticsComponent = null;

const resetDisplayMode = () => {
  menuComponent.setMenuItem(MenuItem.TABLE);
  remove(statisticsComponent);
};

const tripPresenter = new TripPresenter(tripContainerElement, eventsModel, offersModel, filterModel, destinationsModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, eventsModel, resetDisplayMode);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, eventsModel);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      resetDisplayMode();
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      menuComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(tripContainerElement, statisticsComponent, RenderPosition.AFTEREND);
      break;
  }
};

const handleNewEventFormClose = () => {
  newEventBtnElement.disabled = false;
  if (eventsModel.getEvents().length === 0) {
    tripPresenter.init();
  }
};

newEventBtnElement.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  resetDisplayMode();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.createEvent(handleNewEventFormClose);
  evt.target.disabled = true;
});

newEventBtnElement.disabled = true;
tripInfoPresenter.init();
tripPresenter.init();


apiWithProvider.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
    apiWithProvider.getOffers().
      then((offers) => {
        offersModel.setOffers(offers);
        apiWithProvider.getEvents()
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


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
    console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.isSyncRequired) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
