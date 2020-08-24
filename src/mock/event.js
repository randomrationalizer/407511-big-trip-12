import {EVENT_TYPES, EVENT_OFFERS, eventTypeToOffers, CITIES} from "../const.js";

// Максимальное количество предложений в описании
const MAX_SENTENCES_COUNT = 5;

// "Рыба" описания города
const CITY_DESCRIPTION_MOCK = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const MAX_PHOTOS_COUNT = 10;
const MAX_OFFERS_COUNT = 5;
const MAX_PRICE = 500;
const MIN_PRICE = 10;

// Возвращает случайное целое число в диапазоне от a до b (включая b)
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Возвращает случайное значение из массива
const getRandomValue = (values) => {
  const randomIndex = getRandomInteger(0, values.length - 1);
  return values[randomIndex];
};

// Создаёт случайное описание пункта назначения, длина описания - от 1 до 5 передложений
const generateDescription = () => {
  let sentences = CITY_DESCRIPTION_MOCK.split(`. `);

  sentences[sentences.length - 1] = sentences[sentences.length - 1].replace(`.`, ``);

  const sentencesCount = getRandomInteger(1, MAX_SENTENCES_COUNT);

  const description = new Array(sentencesCount).fill().map(() => {
    const randomIndex = getRandomInteger(0, sentences.length - 1);
    return sentences.splice(randomIndex, 1) + `.`;
  }).join(` `);

  return description;
};

// Создаёт массив ссылок фотографий пункта назначения - от 1 до 10
const generatePhotos = () => {
  const photosCount = getRandomInteger(1, MAX_PHOTOS_COUNT);
  const photos = new Array(photosCount).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);

  return photos;
};

// Создаёт моковый объект описания города
const generateCityInfo = () => {
  return {
    description: generateDescription(),
    pics: generatePhotos()
  };
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
export const generateEvent = () => {
  const eventType = getRandomValue(EVENT_TYPES);
  const startDate = generateDate();
  const endDate = generateEndDate(startDate);

  return {
    type: eventType,
    destination: getRandomValue(CITIES),
    cityInfo: generateCityInfo(),
    startDate,
    endDate,
    price: getRandomInteger(MIN_PRICE, MAX_PRICE),
    offers: generateOffers(eventType),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
