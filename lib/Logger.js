const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true
        }),
        new winston.transports.File({
            name: 'info-file',
            filename: './logs/common.log',
            level: 'info'
        }),
        new winston.transports.File({
            name: 'error-file',
            filename: './logs/error.log',
            level: 'error'
        })
    ]
});

module.exports = logger;
