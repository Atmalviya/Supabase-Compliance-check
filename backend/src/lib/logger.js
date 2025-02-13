const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const createLogger = (filename) => {
  return winston.createLogger({
    format: logFormat,
    transports: [
      new DailyRotateFile({
        filename: path.join('logs', `${filename}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d'
      })
    ]
  });
};

const loginLogger = createLogger('login');
const rlsLogger = createLogger('rls');
const mfaLogger = createLogger('mfa');
const pitrLogger = createLogger('pitr');
const signupLogger = createLogger('signup');
const aiLogger = createLogger('ai');

module.exports = {
  loginLogger,
  rlsLogger,
  mfaLogger,
  pitrLogger,
  signupLogger,
  aiLogger
}; 