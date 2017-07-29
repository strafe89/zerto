process.env.NODE_ENV = 'test';

const assert = require('assert');
const execEngine = require('../lib/ExecEngine');

describe('script executing test', function() {

    it('existing script', async function() {
        const scriptName = 'example';
        const result = await execEngine.execute(scriptName);

        assert.equal(typeof result, 'object');
        assert.equal(result.success, true);
        assert.equal(typeof result.output, 'object');
        assert.equal(typeof result.output.stdout, 'string');
        assert.equal(result.output.stderr, '');
    });

    it('script with known output', async function() {
        const scriptName = 'static';
        const result = await execEngine.execute(scriptName);

        assert.equal(typeof result, 'object');
        assert.equal(result.success, true);
        assert.equal(typeof result.output, 'object');
        assert.equal(result.output.stdout, 'qwerty\n');
        assert.equal(result.output.stderr, '');
    });

    it('non-existing script', async function() {
        const scriptName = 'example22';
        const result = await execEngine.execute(scriptName);

        assert.equal(typeof result, 'object');
        assert.equal(result.success, false);
        assert.equal(typeof result.error, 'object');
        assert.equal(result.error.reason, 'Script not found');
    });

    it('async script', async function() {
        const scriptName = 'async';
        const result = await execEngine.execute(scriptName);

        assert.equal(typeof result, 'object');
        assert.equal(result.success, true);
        assert.equal(typeof result.output, 'object');
        assert.equal(result.output.stdout, 'apple\nbanana\norange\n');
        assert.equal(result.output.stderr, '');
    }).timeout(10000);

    it('script with failure', async function() {
        const scriptName = 'failure';
        const result = await execEngine.execute(scriptName);

        assert.equal(typeof result, 'object');
        assert.equal(result.success, false);
        assert.equal(typeof result.error, 'object');
    });

    it('script with syntax error', async function() {
        const scriptName = 'syntax';
        const result = await execEngine.execute(scriptName);

        assert.equal(typeof result, 'object');
        assert.equal(result.success, false);
        assert.equal(typeof result.error, 'object');
    });
});
