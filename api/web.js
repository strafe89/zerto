const router = require('koa-router')();
const execEngine = require('../lib/ExecEngine');

router.get('/exec/:scriptName', async function(ctx) {
    const { scriptName } = ctx.params;
    const result = await execEngine.execute(scriptName);

    ctx.body = result;
});

module.exports = router;
