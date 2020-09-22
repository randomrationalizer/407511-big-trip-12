import AbstractView from "./abstract.js";
import {MenuItem} from "../const";
import {capitalize} from "../utils/common.js";

// Возвращает шаблон блока меню
const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" data-menu-item="${MenuItem.TABLE}" href="#">${capitalize(MenuItem.TABLE)}</a>
      <a class="trip-tabs__btn" data-menu-item="${MenuItem.STATS}" href="#">${capitalize(MenuItem.STATS)}</a>
    </nav>`;
};

export default class MenuView extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const activeItem = this.getElement().querySelector(`.trip-tabs__btn--active`);
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (item !== null) {
      activeItem.classList.remove(`trip-tabs__btn--active`);
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}
