const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logger = morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
});

module.exports = logger;
