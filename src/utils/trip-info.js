// Вычисляет затраты на путешествие
const calculateTotalCosts = (tripEvents) => {
  const eventsCosts = tripEvents.reduce((cost, tripEvent) => cost + tripEvent.price, 0);
  const offersCosts = tripEvents.reduce((total, tripEvent) => {
    let offersSum = 0;
    if (tripEvent.offers !== null) {
      offersSum = tripEvent.offers.reduce((costs, offer) => costs + offer.price, 0);
    }

    return total + offersSum;
  }, 0);

  return eventsCosts + offersCosts;
};


// Создаёт данные для блока информации о путешествии
export const getTripInfo = (tripEvents) => {
  if (tripEvents.length === 0) {
    return null;
  } else {
    const route = tripEvents.map((tripEvent) => tripEvent.destination.name);
    const startDate = tripEvents[0].startDate;
    const endDate = tripEvents[tripEvents.length - 1].endDate;

    return {
      route,
      startDate,
      endDate,
      cost: calculateTotalCosts(tripEvents)
    };
  }
};
