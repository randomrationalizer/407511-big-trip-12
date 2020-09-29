import {nanoid} from "nanoid";
import EventsModel from "../model/events.js";
import {UpdateType} from "../const.js";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, eventsStore, destinationsStore, offersStore, eventsModel) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
    this._eventsModel = eventsModel;

    this._isSyncRequired = false;
  }

  get isSyncRequired() {
    return this._isSyncRequired;
  }

  getEvents() {
    if (Provider.isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer));
          this._eventsStore.setItems(items);
          return events;
        });
    }

    const storedEvents = Object.values(this._eventsStore.getItems());

    return Promise.resolve(storedEvents.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationsStore.setItems(destinations);
          return destinations;
        });
    }

    const storedDestinations = Object.values(this._destinationsStore.getItems());

    return Promise.resolve(storedDestinations);
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._offersStore.setItems(offers);
          return offers;
        });
    }

    const storedOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(storedOffers);
  }

  updateEvent(tripEvent) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(tripEvent)
        .then((updatedEvent) => {
          this._eventsStore.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._eventsStore.setItem(tripEvent.id, EventsModel.adaptToServer(Object.assign({}, tripEvent)));
    this._isSyncRequired = true;

    return Promise.resolve(tripEvent);
  }

  addEvent(tripEvent) {
    if (Provider.isOnline()) {
      return this._api.addEvent(tripEvent)
        .then((newEvent) => {
          this._eventsStore.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, tripEvent, {id: localNewEventId});

    this._eventsStore.setItem(localNewEvent.id, EventsModel.adaptToServer(localNewEvent));
    this._isSyncRequired = true;

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(tripEvent) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(tripEvent)
        .then(() => this._eventsStore.removeItem(tripEvent.id));
    }

    this._eventsStore.removeItem(tripEvent.id);
    this._isSyncRequired = true;

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storedEvents = Object.values(this._eventsStore.getItems());

      return this._api.sync(storedEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updatedEvents = getSyncedEvents(response.updated);
          const items = [...createdEvents, ...updatedEvents];

          this._eventsStore.setItems(createStoreStructure(items));
          this._eventsModel.setEvents(UpdateType.MINOR, items.map(EventsModel.adaptToClient));

          this._isSyncRequired = false;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
