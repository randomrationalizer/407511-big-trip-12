import AbstractView from "../view/abstract.js";

// Перечисление позиций отрисовки элемента
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

// Отрисовывает элемент на странице
export const render = (container, element, place) => {
  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  if (container instanceof AbstractView) {
    container = container.getElement();
  }

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

// Удаляет элемент
export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

// Заменяет один элемент другим
export const replace = (newElement, oldElement) => {
  if (newElement instanceof AbstractView) {
    newElement = newElement.getElement();
  }

  if (oldElement instanceof AbstractView) {
    oldElement = oldElement.getElement();
  }

  const parent = oldElement.parentElement;

  if (parent === null || newElement === null || oldElement === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newElement, oldElement);
};
