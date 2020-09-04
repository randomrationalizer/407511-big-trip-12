import {capitalize} from "../utils/common.js";
import {SortType} from "../const.js";
import AbstractView from "./abstract.js";

// Возвращает шаблон одного элемента сортировки
const createEventSortItemTemplate = (sortType) => {
  const isDefault = sortType === SortType.DEFAULT ? true : false;

  return `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input data-sort-type="${sortType}" id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isDefault ? `checked` : ``}>
    <label class="trip-sort__btn" for="sort-${sortType}">
      ${capitalize(sortType)}
    </label>
  </div>`;
};

// Возвращает шаблон блока сортировки точек маршрута
const createEventSortTemplate = () => {
  const sortItemsTemplate = Object.values(SortType).map((sortType) => createEventSortItemTemplate(sortType)).join(``);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItemsTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`;
};

export default class SortView extends AbstractView {
  constructor() {
    super();
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return createEventSortTemplate();
  }

  _sortChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._callback.sortChange(evt.target.dataset.sortType);
  }

  setSortChangeHandler(callback) {
    this._callback.sortChange = callback;
    this.getElement().addEventListener(`change`, this._sortChangeHandler);
  }
}
