'use strict';

const {getServer} = require(`../api-server`);
const {getLogger} = require(`../logger`);
const {ExitCode} = require(`../../constants`);
const getMockData = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const logger = getLogger();

    try {
      const mockData = await getMockData();
      const server = await getServer(mockData);

      server.listen(port, (err) => {
        if (err) {
          logger.error(`Ошибка при создании сервера`, err);
        }

        logger.info(`Server is running on port: ${port}`);
      });
    } catch (err) {
      logger.error(`Произошла ошибка: ${err.message}`, err);
      process.exit(ExitCode.ERROR);
    }
  }
};
