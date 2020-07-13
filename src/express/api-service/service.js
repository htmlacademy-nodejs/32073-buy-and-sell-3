'use strict';

class ApiService {

  constructor(api) {
    this._api = api;
  }

  async getAllOffers() {
    return await this._api.get(`/offers`);
  }

  async getOfferById(offerId) {
    return await this._api.get(`/offers/${offerId}`);
  }

  async createNewOffer(offerData) {
    return await this._api.post(`/offers`, offerData);
  }

  async getAllCategories() {
    return await this._api.get(`/categories`);
  }

  async searchOffers(query) {
    return await this._api.get(`/search?query=${encodeURI(query)}`);
  }

}

module.exports = ApiService;
