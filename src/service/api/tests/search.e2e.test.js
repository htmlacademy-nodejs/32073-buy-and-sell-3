"use strict";

let request = require(`supertest`);

const {HttpCode, API_PREFIX} = require(`../../../constants`);
const {getServer} = require(`../../api-server`);
const getMockData = require(`../../lib/get-mock-data`);

let server;
let mockData;

beforeAll(async () => {
  mockData = await getMockData();
  server = await getServer(mockData);
});

describe(`Search API end-to-end tests`, () => {

  test(`Get empty offers array with status code 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({query: `Тестовый текст поиска предложения`});
    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(res.body.length).toBe(0);
  });

  test(`Get searched offers array with status code 200`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({query: mockData[0].title});

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test(`Search ends with status code 400`, async () => {
    const res = await request(server).get(`${API_PREFIX}/search`).query({param: `Продам`});

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
