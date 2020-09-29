// Типы событий
export const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export const TRANSFER_EVENTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

// Перечисление типов сортировки точек маршрута
export const SortType = {
  DEFAULT: `event`,
  TIME_DOWN: `time`,
  PRICE_DOWN: `price`
};

// Типы пользовательских событий
export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`,
  ADD_TO_FAVORITE: `ADD_TO_FAVORITE`
};

// Степень вносимых изменений
export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  POINTWISE: `POINTWISE`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};
