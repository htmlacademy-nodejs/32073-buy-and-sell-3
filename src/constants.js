'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  ExitCode: {
    error: 1,
    success: 0,
  },
  HttpCode: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    CREATED: 201,
  },

  DefaultPort: {
    FRONT_SERVER: 8080,
    SERVICE_SERVER: 3000
  },

  MAX_ID_LENGTH: 6,
  API_PREFIX: `/api`,
  PUBLIC_DIR: `public`,
};
