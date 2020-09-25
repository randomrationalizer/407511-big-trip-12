import AbstractView from "./abstract.js";

const createLoadingMsgTemplate = () => {
  return `<p class="trip-events__msg">Loading...</p>`;
};

export default class LoadingMsgView extends AbstractView {
  getTemplate() {
    return createLoadingMsgTemplate();
  }
}
