const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');
const util = require('util');
const logger = require('./Logger');
const execFileAsync = util.promisify(childProcess.execFile);
const existsAsync = util.promisify(fs.exists);
const readDirAsync = util.promisify(fs.readdir);

/** Class representing a script execution engine. */
class ExecEngine {
    /**
     * Creates an engine.
     */
    constructor() {
        this.repo = path.join(__dirname, '../repo');
    }

    /**
     * Executes the script
     * @param {string} scriptName - Script name.
     * @returns {Object} result - Execution results.
     * @returns {Object} result.output - Shell output.
     * @returns {string} result.output.stdout - Standard output.
     * @returns {string} result.output.stderr - Standard error.
     * @returns {string} output.executionTime - Execution time.
     * @returns {boolean} output.success - Operation success.
     * @returns {Object} result.error - Error object.
     */
    async execute(scriptName) {
        let result;
        try {
            if (!scriptName || typeof scriptName !== 'string') {
                logger.error('Invalid script name:', scriptName);
                throw { reason: 'Invalid script name' };
            }

            scriptName = scriptName.replace(/.js$/, '');

            const scriptPath = path.join(this.repo, scriptName + '.js');
            logger.info('Trying to execute script: ', scriptPath);

            const fileExists = await existsAsync(scriptPath);

            if (!fileExists) {
                logger.error('Script not found:', scriptPath);
                throw { reason: 'Script not found' };
            }

            const cmd = 'node';
            const args = [scriptPath];
            const start = Date.now();
            const output = await execFileAsync(cmd, args);
            const executionTime = (Date.now() - start) / 1000;
            result = {
                executionTime: executionTime + ' s',
                success: true,
                output
            };
        } catch (e) {
            logger.error('Script error:', e);
            result = {
                success: false,
                error: e
            }
        }
        logger.info('Script execution results:', result);

        return result;
    }

    /**
     * Returns scripts existed in repo
     * @returns {Array.<String>} list - Scripts list.
     */
    async getScriptsList() {
        const list = readDirAsync(this.repo);

        return list;
    }
}

module.exports = new ExecEngine();
