// Названия городов назначения
export const CITIES = [`Amsterdam`, `Vienna`, `Geneva`, `Lucerne`, `Chamonix`, `Saint Petersburg`];

// Типы событий
export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export const TRANSFER_EVENTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

// Дополнительные опции
export const EVENT_OFFERS = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 30
  },

  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 100,
  },

  {
    type: `meal`,
    title: `Add meal`,
    price: 15
  },

  {
    type: `seats`,
    title: `Choose seats`,
    price: 5
  },

  {
    type: `train`,
    title: `Travel by train`,
    price: 40
  },

  {
    type: `uber`,
    title: `Order Uber`,
    price: 20
  },

  {
    type: `rent`,
    title: `Rent a car`,
    price: 200
  },

  {
    type: `breackfast`,
    title: `Add breakfast`,
    price: 50
  },

  {
    type: `lunch`,
    title: `Lunch in city`,
    price: 30
  },

  {
    type: `tickets`,
    title: `Book tickets`,
    price: 40
  }
];

// Соответствие типа события и дополнительных опций
export const eventTypeToOffers = {
  "taxi": [`uber`],
  "bus": null,
  "train": null,
  "ship": null,
  "transport": null,
  "drive": [`rent`],
  "flight": [`luggage`, `comfort`, `meal`, `seats`, `train`],
  "check-in": [`breackfast`],
  "sightseeing": [`tickets`, `lunch`],
  "restaurant": null
};

// Сортировка по умолчанию - Event (разбивка по дням)
export const SORT_BY_DEFAULT = `event`;

// Фильтрация по умолчанию - Everything (все прошлые и будущие события)
export const FILTER_BY_DEFAULT = `everything`;
