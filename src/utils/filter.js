import {FilterType} from "../const.js";
import {isEventPast, isEventFuture} from "./event.js";

// Соответствие названий фильтров и функций, возвращающих события маршрута, удовлетворяющие условиям фильтра
export const filter = {
  [FilterType.EVERYTHING]: (tripEvents) => tripEvents,
  [FilterType.FUTURE]: (tripEvents) => tripEvents.filter((tripEvent) => isEventFuture(tripEvent.startDate)),
  [FilterType.PAST]: (tripEvents) => tripEvents.filter((tripEvent) => isEventPast(tripEvent.endDate))
};
