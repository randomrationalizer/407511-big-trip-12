import {formatDateToIso} from "../util.js";

// Возваращает дату в виде строки в формате: гггг-мм-дд
const getFormatedDate = (date) => {
  return formatDateToIso(date).slice(0, 10);
};

// Возвращает массив дат путешествия
const createDayDates = (tripEvents) => {
  const dates = tripEvents.map((tripEvent) => getFormatedDate(tripEvent.startDate));
  const datesSet = new Set(dates);
  const uniqueDates = Array.from(datesSet);

  return uniqueDates;
};

// Возвращает данные дней путешествия
export const generateDays = (tripEvents) => {
  const dates = createDayDates(tripEvents);

  return dates.map((date) => {
    const matchEvents = tripEvents.filter((tripEvent) => getFormatedDate(tripEvent.startDate) === date);

    return {
      date,
      count: matchEvents.length,
      dayEvents: matchEvents
    };
  });
};
