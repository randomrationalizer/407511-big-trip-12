import Observer from "../utils/observer.js";

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
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
}
