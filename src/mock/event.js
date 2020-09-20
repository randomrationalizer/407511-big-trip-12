import {EVENT_TYPES, EVENT_OFFERS, eventTypeToOffers} from "../const.js";

const MAX_OFFERS_COUNT = 5;
const MAX_PRICE = 500;
const MIN_PRICE = 10;

// Возвращает случайное целое число в диапазоне от a до b (включая b)
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Генерирует случайный id (только для моков)
export const generateId = () => Date.now() + getRandomInteger(0, 10000);

// Возвращает случайное значение из массива
const getRandomValue = (values) => {
  const randomIndex = getRandomInteger(0, values.length - 1);
  return values[randomIndex];
};

// Создаёт массив дополнительных опций для точки маршрута - от 0 до 5
const generateOffers = (eventType) => {

  const eventOffers = eventTypeToOffers[eventType];

  if (eventOffers === null) {
    return null;
  }

  const selectedOffers = eventOffers.map((offer) => EVENT_OFFERS.find((elem) => elem.type === offer));

  const offersCount = selectedOffers.length > MAX_OFFERS_COUNT ? getRandomInteger(0, MAX_OFFERS_COUNT) : getRandomInteger(0, selectedOffers.length);

  if (offersCount === 0) {
    return null;
  }

  return selectedOffers.slice(0, offersCount);
};

// Создаёт случайное значение даты начала точки маршрута в интервале +- 7 дней от текущей даты
const generateDate = () => {
  const maxDaysGap = 10;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const hour = getRandomInteger(0, 23);
  const minute = getRandomInteger(0, 59);

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + daysGap);
  currentDate.setHours(hour, minute, 0, 0);

  return new Date(currentDate);
};

// Создаёт случайное значение даты окончания точки маршрута в интервале + 0-2 дня от текущей даты
const generateEndDate = (startDate) => {
  const maxDaysGap = 2;
  const daysGap = getRandomInteger(0, maxDaysGap);
  const hoursGap = getRandomInteger(0, 23);
  const minutesGap = getRandomInteger(0, 59);

  let currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + daysGap);
  currentDate.setHours(startDate.getHours() + hoursGap, startDate.getMinutes() + minutesGap, 0, 0);

  return new Date(currentDate);
};


// Создаёт моковый объект точки маршрута
export const generateEvent = (destinations) => {
  const eventType = getRandomValue(EVENT_TYPES);
  const startDate = generateDate();
  const endDate = generateEndDate(startDate);

  return {
    id: generateId(),
    type: eventType,
    destination: getRandomValue(destinations),
    startDate,
    endDate,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: generateOffers(eventType),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
