import {TRANSFER_EVENTS, EVENT_OFFERS, eventTypeToOffers} from "../const.js";

// Возвращает дату в виде строки в формате ISO гггг-мм-ддTчч:мм
export const formatDateToIso = (date) => {
  const year = date.getFullYear();
  const month = (`0` + (1 + date.getMonth())).slice(-2);
  const day = (`0` + date.getDate()).slice(-2);
  const hour = (`0` + date.getHours()).slice(-2);
  const minutes = (`0` + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hour}:${minutes}`;
};

// Возвращает дату в виде строки в формате: Mar 18
export const createShortDate = (date) => {
  return date.toLocaleDateString(`en-US`, {month: `short`, day: `numeric`});
};

// Возвращает правильный предлог для заголовка точки маршрута
export const createPreposition = (type) => {
  return TRANSFER_EVENTS.includes(type) ? `to` : `in`;
};

// Сравнение для сортировки событий по убыванию стоимости
export const sortByPrice = (first, second) => {
  return second.price - first.price;
};

// Сравнение для сортировки событий по убыванию длительности
export const sortByTime = (first, second) => {
  const firstDuration = first.endDate.getTime() - first.startDate.getTime();
  const secondDuration = second.endDate.getTime() - second.startDate.getTime();
  return secondDuration - firstDuration;
};

// Сравнение для сортировки событий в хронологическом порядке
export const sortByDate = (first, second) => {
  return first.startDate.getTime() - second.startDate.getTime();
};

export const isAnyOffersAvailable = (eventType) => {
  return eventTypeToOffers[eventType] !== null;
};

export const getAvailableOffers = (eventType) => {
  const availableOffers = eventTypeToOffers[eventType];

  return availableOffers === null ? null : availableOffers.map((offer) => EVENT_OFFERS.find((elem) => elem.type === offer));
};
