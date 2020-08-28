import {TRANSFER_EVENTS} from "./const.js";

// Перечисление позиций отрисовки элемента
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

// Отрисовывает элемент на странице
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement(place, element);
      break;
  }
};

// Возвращает DOM-элемент из шаблона
export const createElement = (template) => {
  let newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
