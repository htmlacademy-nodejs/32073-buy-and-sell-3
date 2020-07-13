'use strict';

const path = require(`path`);
const express = require(`express`);
const chalk = require(`chalk`);
const {createAPI} = require(`./axios-api`);
const ApiService = require(`./api-service/service`);
const {getLogger, httpLoggerMiddleware} = require(`./libs/logger`);
const logger = getLogger();

const {
  getOffersRouter,
  getMyRouter,
  getMainRouter
} = require(`./routes`);

const {
  HttpCode,
  DefaultPort,
  ExitCode,
  PUBLIC_DIR
} = require(`../constants`);

const service = new ApiService(createAPI());
const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: false}));

app.use(httpLoggerMiddleware);
app.use((req, res, next) => {
  logger.info(`Incoming request ${req.originalUrl}`);
  next();
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, getMainRouter(service));
app.use(`/my`, getMyRouter(service));
app.use(`/offers`, getOffersRouter(service));

app.use((req, res, next) => {
  logger.error(`404 middleware. Not found`);

  res.status(HttpCode.NOT_FOUND).render(`errors/404`, {
    errorCode: HttpCode.NOT_FOUND
  });
});

app.use((error, req, res, next) => {
  logger.error(`Internal error. ${error}`);

  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`, {
    errorCode: HttpCode.INTERNAL_SERVER_ERROR
  });
});

app.listen(DefaultPort.FRONT_SERVER, (err) => {

  if (err) {
    logger.error(`Can't launch server: ${err}`);
    process.exit(ExitCode.ERROR);
  }

  logger.info(`Server launched. Listening port: ${DefaultPort.FRONT_SERVER}`);
});
