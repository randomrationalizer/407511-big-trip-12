import AbstractView from "./abstract.js";

// Возвращает шаблон списка дней путешествия
const createDaysListTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class DaysListView extends AbstractView {
  getTemplate() {
    return createDaysListTemplate();
  }
}
