"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const getMockData = require(`../../lib/get-mock-data`);

let server;
let mockData;

const newOfferData = {
  category: [`Разное`],
  description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
  picture: `item03.jpg`,
  title: `Продам новую приставку Sony Playstation 5.`,
  sum: 42698,
  type: `offer`,
  comments: []
};
const updatedOfferData = {
  category: [`Авто`],
  description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
  picture: `item03.jpg`,
  title: `Новый заголовок`,
  sum: 900,
  type: `offer`,
  comments: []
};
const incorrectOfferData = {
  description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
  picture: `item03.jpg`,
  title: `Новый заголовок`,
  sum: 900,
  type: `offer`,
  comments: []
};

beforeAll(async () => {
  mockData = await getMockData();
  server = await getServer(mockData);
});

describe(`Offers API end-to-end tests`, () => {
  describe(`Get all offers tests`, () => {
    test(`Get all offers with status code 200 and mockData should be returned in a response`, async () => {
      const res = await request(server).get(`${API_PREFIX}/offers`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(mockData);
    });
  });

  describe(`Get offer by id tests`, () => {
    test(`Get offer by id with status code 200`, async () => {
      const offerId = mockData[0].id;
      const res = await request(server).get(`${API_PREFIX}/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(mockData[0]);
    });

    test(`If offer doesn't exist status code 404`, async () => {
      const offerId = `UNKNOWN_ID`;
      const res = await request(server).get(`${API_PREFIX}/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Not found with ${offerId}`);
    });
  });

  describe(`Create new offer test`, () => {

    test(`Must create a new offer and return it with status code 201`, async () => {
      const res = await request(server).post(`${API_PREFIX}/offers`).send(newOfferData);
      const returnedNewOffer = {...newOfferData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedNewOffer);
    });

    test(`Invalid offer data sent. Request must end with status code 400`, async () => {
      const newOffer = {
        description: `При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе. Пользовались бережно и только по большим праздникам., Бонусом отдам все аксессуары.`,
        picture: `item03.jpg`,
        title: `Продам новую приставку Sony Playstation 5.`,
        sum: 42698,
        type: `offer`,
        comments: []
      };
      const res = await request(server).post(`${API_PREFIX}/offers`).send(newOffer);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Bad request`);
    });
  });

  describe(`Get offer comments tests`, () => {

    test(`Get offer comments with status code 200`, async () => {
      const offerId = mockData[0].id;
      const res = await request(server).get(`${API_PREFIX}/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(mockData[0].comments);
    });

    test(`Get offer comments with status code 404 (offer not found)`, async () => {
      const offerId = `UNKNOWN_ID`;
      const res = await request(server).get(`${API_PREFIX}/offers/${offerId}/comments`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Offer with ${offerId} not found`);
    });
  });

  describe(`Create a new comment tests`, () => {

    test(`Create a new comment with status code 200`, async () => {
      const offerId = mockData[0].id;
      const commentData = {text: `New test comment`};
      const res = await request(server).post(`${API_PREFIX}/offers/${offerId}/comments`).send(commentData);
      const returnedComment = {...commentData, id: res.body.id};

      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body).toStrictEqual(returnedComment);
    });

    test(`Create a new comment with status code 400 (incorrect comment data)`, async () => {
      const offerId = mockData[0].id;
      const commentData = {message: `New test comment`};
      const res = await request(server).post(`${API_PREFIX}/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Bad request`);
    });

    test(`Create a new comment with status code 404 (offer not found)`, async () => {
      const offerId = `UNKNOWN_ID`;
      const commentData = {text: `New test comment`};
      const res = await request(server).post(`${API_PREFIX}/offers/${offerId}/comments`).send(commentData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Offer with ${offerId} not found`);
    });

  });

  describe(`Delete offer comments tests`, () => {

    test(`Delete one offer comment with status code 200`, async () => {
      const offerId = mockData[0].id;
      const comment = mockData[0].comments[0];
      const commentId = comment.id;
      const res = await request(server).delete(`${API_PREFIX}/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(comment);
    });

    test(`Delete one offer comment with status code 404 (offer not found)`, async () => {
      const offerId = `UNKNOWN_ID`;
      const comment = mockData[0].comments[0];
      const commentId = comment.id;
      const res = await request(server).delete(`${API_PREFIX}/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Offer with ${offerId} not found`);
    });

    test(`Delete one offer comment with status code 404 (comment not found)`, async () => {
      const offerId = mockData[0].id;
      const commentId = `UNKNOWN_ID`;
      const res = await request(server).delete(`${API_PREFIX}/offers/${offerId}/comments/${commentId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Not found`);
    });

  });

  describe(`Update offer by id tests`, () => {

    test(`Update offer by id with status code 200`, async () => {
      const offerId = mockData[0].id;
      const res = await request(server).put(`${API_PREFIX}/offers/${offerId}`).send(updatedOfferData);
      const updatedOffer = {...updatedOfferData, id: offerId};

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(updatedOffer);
    });

    test(`Update offer by id with status code 400`, async () => {
      const offerId = mockData[0].id;
      const res = await request(server).put(`${API_PREFIX}/offers/${offerId}`).send(incorrectOfferData);

      expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Bad request`);
    });

    test(`Update offer by id with status code 404`, async () => {
      const offerId = `UNKNOWN_ID`;
      const res = await request(server).put(`${API_PREFIX}/offers/${offerId}`).send(updatedOfferData);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Not found with ${offerId}`);
    });

  });

  describe(`Delete offer by id tests`, () => {

    test(`Delete offer by id with status code 200`, async () => {
      const offerId = mockData[0].id;
      const res = await request(server).delete(`${API_PREFIX}/offers/${offerId}`);
      const deletedOffer = {...updatedOfferData, id: offerId};

      expect(res.statusCode).toBe(HttpCode.OK);
      expect(res.body).toStrictEqual(deletedOffer);
    });

    test(`Delete offer by id with status code 404 (offer not found)`, async () => {
      const offerId = `AVvorrFg4`;
      const res = await request(server).delete(`${API_PREFIX}/offers/${offerId}`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Not found`);
    });
  });

  describe(`Route doesn't exist test`, () => {

    test(`Request must end with status code 404`, async () => {
      const res = await request(server).get(`${API_PREFIX}/test`);

      expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
      expect(res.error).toBeTruthy();
      expect(res.error.text).toBe(`Not found`);
    });

  });
});
