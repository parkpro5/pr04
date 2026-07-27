const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

app.listen(env.PORT, () => {
  logger.info(`Backend listening on port ${env.PORT}`);
});
