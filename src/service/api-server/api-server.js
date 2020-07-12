'use strict';

const express = require(`express`);
const {getLogger} = require(`../logger`);
const expressPinoLogger = require(`express-pino-logger`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const {getRoutes} = require(`../api`);

const getServer = async (mockData) => {
  const routes = getRoutes(mockData);
  const server = express();
  const logger = getLogger();

  server.use(expressPinoLogger({logger}));
  server.use(express.json());

  server.use((req, res, next) => {
    logger.debug(`Started request to url ${req.url}`);
    next();
  });

  server.use(API_PREFIX, routes);

  server.use((req, res) => {
    logger.error(`Request to (${req.url}) ended with error ${HttpCode.NOT_FOUND}. `);
    return res.status(HttpCode.NOT_FOUND).send(`Not found`);
  });

  return server;
};

module.exports = {getServer};

