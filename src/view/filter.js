import {capitalize} from "../util.js";

// Возвращает шаблон одного элемента фильтра
const createFilterItemTemplate = (filter) => {
  const {name, isActive} = filter;

  return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isActive ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${capitalize(name)}</label>
  </div>`;
};

// Возвращает шаблон блока фильтрации точек маршрута
export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join(``);

  return `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};
