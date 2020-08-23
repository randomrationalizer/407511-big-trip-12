import {TRANSFER_EVENTS} from "./const.js";

// Возвращает строку с заглавной первой буквой
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Возвращает дату в виде строки в формате ISO гггг-мм-ддTчч:мм
export const formatDateToIso = (date) => {
  const year = date.getFullYear();
  const month = (`0` + (1 + date.getMonth())).slice(-2);
  const day = (`0` + date.getDate()).slice(-2);
  const hour = (`0` + date.getHours()).slice(-2);
  const minutes = (`0` + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hour}:${minutes}`;
};

// Возварщает дату в виде строки в формате: Mar 18
export const createShortDate = (date) => {
  return date.toLocaleDateString(`en-US`, {month: `short`, day: `numeric`});
};

// Возвращает правильный предлог для заголовка точки маршрута
export const createPreposition = (type) => {
  return TRANSFER_EVENTS.includes(type) ? `to` : `in`;
};
