import {capitalize} from "../utils/common.js";
import {SORT_BY_DEFAULT} from "../const.js";
import AbstractView from "./abstract.js";

// Возвращает шаблон одного элемента сортировки
const createEventSortItemTemplate = (sortItem) => {
  const {name, isActive} = sortItem;
  const isDefault = name === SORT_BY_DEFAULT ? true : false;

  return `<div class="trip-sort__item  trip-sort__item--${name}">
    <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isActive ? `checked` : ``}>
    <label class="trip-sort__btn" for="sort-${name}">
      ${capitalize(name)}
      ${!isDefault ? `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
      <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
    </svg>` : ``}
    </label>
  </div>`;
};

// Возвращает шаблон блока сортировки точек маршрута
const createEventSortTemplate = (sort) => {
  const sortItemsTemplate = sort.map((sortItem) => createEventSortItemTemplate(sortItem)).join(``);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItemsTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`;
};

export default class SortView extends AbstractView {
  constructor(sort) {
    super();
    this._sort = sort;
  }

  getTemplate() {
    return createEventSortTemplate(this._sort);
  }
}
