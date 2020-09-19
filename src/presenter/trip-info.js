import {getTripInfo} from "../utils/trip-info.js";
import {sortByDate} from "../utils/event";
import {render, remove, replace, RenderPosition} from "../utils/render";
import TripInfoView from "../view/trip-info.js";


// Презентер информации о путешествии
export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this._tripInfoComponent;

    const tripEvents = this._eventsModel.getEvents().sort(sortByDate);
    const tripInfo = getTripInfo(tripEvents);
    this._tripInfoComponent = new TripInfoView(tripInfo);

    if (prevTripInfoComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
