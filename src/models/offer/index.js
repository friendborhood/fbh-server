const { insideCircle } = require('geolocation-utils');

const getOffersInArea = ({ offers, radiusInMeters, targetLocation }) => {
  const offersInRadius = Object.values(offers).filter((offer) => {
    const isInsideCircle = insideCircle(offer.location.geoCode, targetLocation, radiusInMeters);
    return isInsideCircle;
  });
  return offersInRadius;
};

const relevantOffers = getOffersInArea({
  offers: {
    offerBeerShave: {
      name: 'beer sheva',
      location: {
        geoCode: {
          lat: 31.27566902435525, lon: 34.75106102314429,
        },
      },
    },
    offerTlv: {
      name: 'shooki kosem',
      location: {
        geoCode: {
          lat: 32.1716207368198, lon: 34.847595734248976,
        },
      },
    },
    offerUsa: {
      location: {
        geoCode: {
          lat: 38.68283263477214, lon: -9.063595043382376,
        },
      },
    },
    offerAfrica: {
      location: {
        geoCode: {
          lat: 28.19485862635811, lon: 18.348766841649137,
        },
      },
    },
  },
  radiusInMeters: 20000,
  targetLocation: {
    lat: 32.06235266605632, lon: 34.77191901881545,
  },
});
console.log(JSON.stringify(relevantOffers));
