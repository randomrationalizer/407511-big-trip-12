import {TRANSFER_EVENTS} from "../const.js";
import moment from "moment";

// Возвращает дату в виде строки в формате: "день/месяц/год часы:минуты"
export const formatDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`DD-MM-YY HH:mm`);
};

// Возвращает дату в виде строки в формате ISO гггг-мм-ддTчч:мм
export const formatDateToIso = (date) => {
  return moment(date).format(`YYYY-MM-DD[T]HH:mm`);
};

// Возвращает дату в виде строки в формате: гггг-мм-дд
export const formatDateWithoutTime = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

// Возвращает дату в виде строки в формате: Mar 18
export const createShortDate = (date) => {
  return moment(date).format(`MMM D`);
};

// Возвращает из даты строку времени в формате: чч:мм
export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

// Возвращает длительность события в формате: "1D 1H 10M"
export const getFormatedDuration = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);

  const duration = moment.duration(end.diff(start));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${days > 0 ? `${days}D` : ``} ${hours > 0 ? `${hours}H` : ``} ${minutes > 0 ? `${minutes}M` : ``}`;
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

export const getAvailableOffers = (offers, eventType) => {
  return offers.find((eventOffersMatch) => eventOffersMatch.type === eventType).offers;
};

export const isAnyOffersAvailable = (offers, eventType) => {
  return getAvailableOffers(offers, eventType) !== null;
};

export const isDatesEqual = (firstEvent, secondEvent) => {
  return moment(firstEvent.startDate).isSame(secondEvent.startDate) && moment(firstEvent.endDate).isSame(secondEvent.endDate);
};

// Проверяет, является ли точка маршрута пройденной (дата окончания меньше, чем текущая)
export const isEventPast = (endDate) => {
  const currentDate = new Date();
  return moment(currentDate).isAfter(endDate, `day`);
};

// Проверяет, является ли точка маршрута запланированной (дата начала больше, чем текущая)
export const isEventFuture = (startDate) => {
  const currentDate = new Date();
  return moment(currentDate).isBefore(startDate, `day`);
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

// Возвращает случайное целое число в диапазоне от a до b (включая b)
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Генерирует случайный id (только для моков)
export const generateId = () => Date.now() + getRandomInteger(0, 10000);
