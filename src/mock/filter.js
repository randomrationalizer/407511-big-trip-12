import {FILTER_BY_DEFAULT} from "../const.js";

// Проверяет, является ли точка маршрута пройденной (дата окончания меньше, чем текущая)
const isEventPast = (endDate) => {
  const currentDate = new Date();
  return endDate.getTime() < currentDate.getTime();
};

// Проверяет, является ли точка маршрута запланированной (дата начала больше, чем текущая)
const isEventFuture = (startDate) => {
  const currentDate = new Date();
  return startDate.getTime() > currentDate.getTime();

};

// Мапа соответствия названий фильтров и функций, возвращающих события маршрута, удовлетворяющие условиям фильтра
const eventToFilterMap = {
  everything: (tripEvents) => tripEvents,
  future: (tripEvents) => tripEvents.filter((tripEvent) => isEventFuture(tripEvent.startDate)),
  past: (tripEvents) => tripEvents.filter((tripEvent) => isEventPast(tripEvent.endDate))
};

// Создаёт данные фильтра - массив объектов с именем фильтра и массивом отфильтрованных событий
export const generateFilters = (tripEvents = []) => {
  return Object.entries(eventToFilterMap).map(([filter, filterEvents]) => {
    return {
      name: filter,
      filteredEvents: filterEvents(tripEvents),
      isActive: filter === FILTER_BY_DEFAULT
    };
  });
};

