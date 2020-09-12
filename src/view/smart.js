import AbstractView from "./abstract.js";

// 'Умный' компонент, который умеет себя перерисовывать
export default class Smart extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  // Обновляет данные компонента и вызывает обновление шаблона
  updateData(update, isDataOnlyUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    // Если обновляются только данные, перерисовка шаблона не происходит
    if (isDataOnlyUpdating) {
      return;
    }

    this.updateElement();
  }

  // Удаляет старый DOM элемент, вызывает генерацию нового и заменяет один на другой
  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  // Восстанавливает удалённые с элементом обработчики событий
  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
