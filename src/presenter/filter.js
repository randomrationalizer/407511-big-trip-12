import FilterView from "../view/filter.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {FilterType, UpdateType} from "../const.js";
import {filter} from "../utils/filter.js";


// Презентер фильтра точек маршрута
export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();

    const prevFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (filterType === this._currentFilter) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const tripEvents = this._eventsModel.getEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`,
        isDisabled: filter[FilterType.EVERYTHING](tripEvents).length === 0
      },
      {
        type: FilterType.FUTURE,
        name: `Future`,
        isDisabled: filter[FilterType.FUTURE](tripEvents).length === 0
      },
      {
        type: FilterType.PAST,
        name: `Past`,
        isDisabled: filter[FilterType.PAST](tripEvents).length === 0
      }
    ];
  }
}
