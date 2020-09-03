import {SORT_BY_DEFAULT} from "../const.js";

// Мапа соответствия названий сортировки и функций, возвращающих события маршрута, отсортированные в соответствии с условием
const sortToFilterMap = {
  event: (tripEvents) => tripEvents.slice().sort((first, second) => first.startDate.getTime() - second.startDate.getTime()),
  time: (tripEvents) => tripEvents.slice().sort((first, second) => (second.endDate.getTime() - second.startDate.getTime()) - (first.endDate.getTime() - first.startDate.getTime())),
  price: (tripEvents) => tripEvents.slice().sort((first, second) => second.price - first.price)
};


// Создаёт данные сортировки - массив объектов с именем сортировки и массивом отсортированных событий
export const generateSort = (tripEvents = []) => {
  return Object.entries(sortToFilterMap).map(([sort, sortEvents]) => {
    return {
      name: sort,
      sortedEvents: sortEvents(tripEvents),
      isActive: sort === SORT_BY_DEFAULT
    };
  });
};
