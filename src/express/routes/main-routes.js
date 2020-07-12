'use strict';

const {Router} = require(`express`);
const {getMostDiscussedOffers} = require(`../../utils`);

const getMainRouter = (service) => {

  const mainRouter = new Router();

  mainRouter.get(`/`, async (req, res, next) => {
    try {
      const offers = await service.getAllOffers();
      const categories = await service.getAllCategories();

      return res.render(`main`, {
        offers: offers.slice(0, 8),
        categories,
        mostDiscussedOffers: getMostDiscussedOffers(offers)
      });
    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

  mainRouter.get(`/login`, (req, res) => res.render(`login`));

  mainRouter.get(`/search`, async (req, res, next) => {
    try {
      const {query} = req.query;
      const searchResult = await service.searchOffers(query);
      const offers = await service.getAllOffers();

      return res.render(`search-result`, {
        offers: searchResult,
        mostDiscussedOffers: getMostDiscussedOffers(offers)
      });
    } catch (err) {
      return next(err);
    }
  });

  return mainRouter;
};


module.exports = {getMainRouter};
