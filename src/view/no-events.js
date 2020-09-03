import AbstractView from "./abstract.js";

// Возвращает шаблон сообщения об отсутствии точек маршрута
const createNoEventsTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoEventsView extends AbstractView {
  getTemplate() {
    return createNoEventsTemplate();
  }
}
