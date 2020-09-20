import moment from "moment";
import {TRANSFER_EVENTS} from "../const.js";

// Возвращает события заданного типа
const filterEventsByType = (tripEvents, eventType) => {
  return tripEvents.filter((tripEvent) => tripEvent.type === eventType);
};

// Возвращает map с соответствием типа события и количества поездок на транспорте
export const countTransportUsages = (tripEvents) => {
  const eventTypes = tripEvents.map((tripEvent) => tripEvent.type).filter((type) => TRANSFER_EVENTS.includes(type));
  const transportEventsCount = eventTypes.map((type) => {
    return [type.toUpperCase(), filterEventsByType(tripEvents, type).length];
  }).sort(([, firstCount], [, secondCount]) => secondCount - firstCount);

  return new Map(transportEventsCount);
};

// Возвращает map с соответствием типа события и суммы расходов (без учёта офферов)
export const countEventsTotalCosts = (tripEvents) => {
  const eventTypes = tripEvents.map((tripEvent) => tripEvent.type);
  const eventsCosts = eventTypes.map((type) => {
    return [type.toUpperCase(), filterEventsByType(tripEvents, type).reduce((cost, tripEvent) => cost + tripEvent.price, 0)];
  }).sort(([, firstCosts], [, secondCosts]) => secondCosts - firstCosts);

  return new Map(eventsCosts);
};

// Возвращает длительность события в часах
const countEventDurationInHours = (tripEvent) => {
  const start = moment(tripEvent.startDate);
  const end = moment(tripEvent.endDate);

  const duration = moment.duration(end.diff(start));

  return parseInt(duration.asHours(), 10);
};

// Возвращает суммарную длительность событий заданного типа
const countEventTypeTimeSpent = (tripEvents) => {
  return tripEvents.reduce((totalTime, tripEvent) => totalTime + countEventDurationInHours(tripEvent), 0);
};

// Возвращает map с соответствием тип события и его длительности
export const countEventsDurations = (tripEvents) => {
  const eventTypes = tripEvents.map((tripEvent) => tripEvent.type);

  const eventsDurations = eventTypes.map((type) => {
    return [type.toUpperCase(), countEventTypeTimeSpent(filterEventsByType(tripEvents, type))];
  }).sort(([, firstDuration], [, secondDuration]) => secondDuration - firstDuration);

  return new Map(eventsDurations);
};
