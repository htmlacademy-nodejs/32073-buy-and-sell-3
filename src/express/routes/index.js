'use strict';

const {getOffersRouter} = require(`./offers-routes`);
const {getMyRouter} = require(`./my-routes`);
const {getMainRouter} = require(`./main-routes`);

module.exports = {
  getOffersRouter,
  getMyRouter,
  getMainRouter
};
