const { uuid } = require('short-uuid');
const Joi = require('joi');
const { insideCircle, distanceTo } = require('geolocation-utils');
const getModel = require('../../services/firebase-api/get');
const upsert = require('../../services/firebase-api/upsert');
const add = require('../../services/firebase-api/add');
const { findById } = require('../item');

const modelName = 'offers';
const getDistanceFromOfferToTarget = (offer, target) => {
  const { location: { geoCode: offerGeoCode } } = offer;
  return distanceTo(offerGeoCode, target);
};
const getOffersInArea = ({ offers, radiusInMeters, targetLocation }) => Object.values(offers)
  .filter((offer) => {
    const isInsideCircle = insideCircle(offer.location.geoCode, targetLocation, radiusInMeters);
    return isInsideCircle;
  });

const sortOrdersByDistance = ({ offers, targetLocation }) => Object.values(offers)
  .sort((offerA, offerB) => {
    const distanceFromTargetToA = getDistanceFromOfferToTarget(offerA, targetLocation);
    const distanceFromTargetToB = getDistanceFromOfferToTarget(offerB, targetLocation);
    return distanceFromTargetToA - distanceFromTargetToB;
  });

const relevantOffers = sortOrdersByDistance({
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
      name: 'yuval',
      location: {
        geoCode: {
          lat: 38.68283263477214, lon: -9.063595043382376,
        },
      },
    },
    offerAfrica: {
      name: 'eden',
      location: {
        geoCode: {
          lat: 28.19485862635811, lon: 18.348766841649137,
        },
      },
    },
    jerusalemOffer: {
      name: 'noam',
      location: {
        geoCode: {
          lat: 31.768282467383457, lon: 35.178790083757946,
        },
      },
    },
    modiinOffer: {
      name: 'omer_gery',
      location: {
        geoCode: {
          lat: 31.903431003993127, lon: 34.98240458871311,
        },
      },
    },
    carmelMarket: {
      name: 'hey',
      location: {
        geoCode: {
          lat: 32.06969216175387, lon: 34.77153511285643,
        },
      },

    },
  },
  targetLocation: {
    lat: 32.06235266605632, lon: 34.77191901881545,
  },
});
const modiinOffer = {
  name: 'omer_gery',
  location: {
    geoCode: {
      lat: 31.903431003993127, lon: 34.98240458871311,
    },
  },
};
const targetLocation = {
  lat: 32.06235266605632, lon: 34.77191901881545,
};
const carmelMarket = {
  name: 'hey',
  location: {
    geoCode: {
      lat: 32.06969216175387, lon: 34.77153511285643,
    },
  },
};
// console.log(JSON.stringify(relevantOffers, null, 2));
console.log(distanceTo(carmelMarket.location.geoCode, targetLocation));
