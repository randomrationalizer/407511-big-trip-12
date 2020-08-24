import {capitalize, formatDateToIso, createPreposition} from "../util.js";

// Возвращает длительность события в формате: "1D 1H 10M"
const calculatetimeDiff = (start, end) => {
  const timeDiff = end - start;

  const msInMinute = 60000;
  const msInHour = msInMinute * 60;
  const msInDay = 24 * msInMinute * 60;

  const days = Math.floor(timeDiff / msInDay);
  const hours = Math.floor((timeDiff - days * msInDay) / msInHour);
  const minutes = Math.floor((timeDiff - days * msInDay - hours * msInHour) / msInMinute);

  return `${days > 0 ? `${days}D` : ``} ${hours > 0 ? `${hours}H` : ``} ${minutes > 0 ? `${minutes}M` : ``}`;
};

// Возвращает шаблон дополнительных опций точки маршрута
const createOffersTemplate = (offers) => {

  // const selectedOffers = offers.map((offer) => EVENT_OFFERS.find((elem) => elem.type === offer));

  return `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">

      ${offers.map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`).join(``)}
    </ul>`;
};


// Возвращает шаблон точки маршрута
export const createEventTemplate = (tripEvent) => {
  const {type, destination, startDate, endDate, price, offers} = tripEvent;

  const startTime = startDate.toLocaleTimeString().slice(0, -3);
  const endTime = endDate.toLocaleTimeString().slice(0, -3);
  const duration = calculatetimeDiff(startDate, endDate);
  const offersTemplate = offers ? createOffersTemplate(offers) : ``;

  return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalize(type)} ${createPreposition(type)} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateToIso(startDate)}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateToIso(endDate)}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        ${offersTemplate}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};
