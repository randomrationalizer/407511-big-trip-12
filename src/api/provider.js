import {nanoid} from "nanoid";
import EventsModel from "../model/events.js";

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
  constructor(api, eventsStore, destinationsStore, offersStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
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

    return Promise.resolve(tripEvent);
  }

  addEvent(tripEvent) {
    if (Provider.isOnline()) {
      return this._api.addEvent(tripEvent)
        .then((newEvent) => {
          this._eventsStore.setItem(newEvent.id, EventsModel.adaptToServer(Event));
          return newEvent;
        });
    }

    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, tripEvent, {id: localNewEventId});

    this._eventsStore.setItem(localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(tripEvent) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(tripEvent)
        .then(() => this._eventsStore.removeItem(tripEvent.id));
    }

    this._eventsStore.removeItem(tripEvent.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storedEvents = Object.values(this._eventsStore.getItems());

      return this._api.sync(storedEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._eventsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
