import {capitalize, createElement} from "../util.js";

// Возвращает шаблон одного элемента фильтра
const createFilterItemTemplate = (filter) => {
  const {name, isActive} = filter;

  return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isActive ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${capitalize(name)}</label>
  </div>`;
};

// Возвращает шаблон блока фильтрации точек маршрута
const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join(``);

  return `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FilterView {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
