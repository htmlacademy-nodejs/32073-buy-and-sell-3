'use strict';

const path = require(`path`);
const fs = require(`fs`);

const logsDirectory = path.resolve(__dirname, `../../logs/`);

let streams = [
  {level: `debug`, stream: fs.createWriteStream(`${logsDirectory}/app.txt`)},
  {level: `error`, stream: fs.createWriteStream(`${logsDirectory}/errors.txt`)}
];

if (process.env.NODE_ENV === `development`) {
  streams = streams.concat([
    {level: `debug`, stream: process.stdout},
    {level: `error`, stream: process.stderr}
  ]);
}

const logger = require(`pino`)({
  name: `front-server`,
  level: process.env.LOG_LEVEL || `info`,
  prettyPrint: true,
}, require(`pino-multi-stream`).multistream(streams));

const httpLogger = require(`pino-http`)({
  logger,
  useLevel: `info`
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
  httpLoggerMiddleware: httpLogger
};
