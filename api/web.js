const router = require('koa-router')();
const execEngine = require('../lib/ExecEngine');

router.get('/exec/:scriptName', async function(ctx) {
    const { scriptName } = ctx.params;
    const result = await execEngine.execute(scriptName);

    ctx.body = result;
});

router.get('/scripts', async function(ctx) {
    const scriptsList = await execEngine.getScriptsList();

    ctx.body = { scripts: scriptsList };
});

module.exports = router;
