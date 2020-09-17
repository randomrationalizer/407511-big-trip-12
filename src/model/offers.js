import Observer from "../utils/observer.js";

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }
}


// В презентере замените прямую работу с моковым массивом точек офферов на работу с моделью: для получения и обновления данных используйте соответствующие методы модели.
