import {formatDateWithoutTime} from "../utils/event.js";

// Возвращает массив дат путешествия
const createDayDates = (tripEvents) => {
  const dates = tripEvents.map((tripEvent) => formatDateWithoutTime(tripEvent.startDate));
  const datesSet = new Set(dates);
  const uniqueDates = Array.from(datesSet);

  return uniqueDates;
};

// Возвращает данные дней путешествия
export const generateDays = (tripEvents) => {
  const dates = createDayDates(tripEvents);

  return dates.map((date) => {
    const matchEvents = tripEvents.filter((tripEvent) => formatDateWithoutTime(tripEvent.startDate) === date);

    return {
      date,
      dayEvents: matchEvents
    };
  });
};
