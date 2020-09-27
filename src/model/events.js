import Observer from "../utils/observer.js";

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, updatedEvent) {
    const index = this._events.findIndex((tripEvent) => tripEvent.id === updatedEvent.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [...this._events.slice(0, index), updatedEvent, ...this._events.slice(index + 1)];

    this._notify(updateType, updatedEvent);
  }

  addEvent(updateType, newEvent) {
    this._events = [newEvent, ...this._events];
    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, eventToDelete) {
    const index = this._events.findIndex((tripEvent) => tripEvent.id === eventToDelete.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
    this._notify(updateType);
  }

  // Адаптирует объект точки маршрута к формату приложения
  static adaptToClient(tripEvent) {
    const adaptedEvent = Object.assign(
        {},
        tripEvent,
        {
          price: tripEvent.base_price,
          startDate: tripEvent.date_from !== null ? new Date(tripEvent.date_from) : tripEvent.date_from,
          endDate: tripEvent.date_to !== null ? new Date(tripEvent.date_to) : tripEvent.date_to,
          isFavorite: tripEvent.is_favorite
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  // Адаптирует объект точки маршрута к формату сервера
  static adaptToServer(tripEvent) {
    const adaptedEvent = Object.assign(
        {},
        tripEvent,
        {
          "base_price": tripEvent.price,
          "date_from": tripEvent.startDate !== null ? tripEvent.startDate.toISOString() : tripEvent.startDate,
          "date_to": tripEvent.endDate !== null ? tripEvent.endDate.toISOString() : tripEvent.endDate,
          "is_favorite": tripEvent.isFavorite
        }
    );

    delete adaptedEvent.price;
    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
