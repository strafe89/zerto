const Koa = require('koa');
const router = require('koa-router')();
const config = require('config');
const app = new Koa();

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('catched on top - ', err);
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = { error: err.message || err };
    }
});

router.get('/', function(ctx) {
    ctx.body = 'bingo api is healthy';
});

app.listen(config.api.port);
