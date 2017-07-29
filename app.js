const Koa = require('koa');
const config = require('config');
const cors = require('koa-cors');
const koaLogger = require('koa-logger-winston');
const logger = require('./lib/Logger');
const webApi = require('./api/web');
const app = new Koa();
const rabbitClient = require('./api/rabbit');

app.use(cors());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        logger.error('catched on top - ', err);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = { error: err.message || err };
    }
});

app.use(koaLogger(logger));

app.use(webApi.routes());

app.listen(config.api.port);

logger.info('Web API is listening on port', config.api.port);

rabbitClient.start();
