const amqp = require('amqplib');
const cfg = require('config');
const execEngine = require('../lib/ExecEngine');
const logger = require('../lib/Logger');

/** Class representing a RabbitMQ client. */
class RabbitClient {
    /**
     * Creates an client instance.
     */
    constructor() {
        this.queueName = 'zerto_rpc';
        this.prefetchCount = 10;

        this.connection = null;
        this.channel = null;
    }

    /**
     * Starts a client.
     */
    async start() {
        if (!cfg.rabbit.enabled) {
            logger.warn('RabbitMQ client is disabled');
            return;
        }

        await this.connect();
        await this.consumeMessages();
    }

    /**
     * Inits a connection.
     * @returns {Object} connection - RabbitMQ connection.
     */
    async connect() {
        try {
            logger.info(`Trying to connect to RabbitMQ ${cfg.rabbit.url}`);

            const connection = this.connection = await amqp.connect(cfg.rabbit.url + '?heartbeat=10');

            logger.log(`RabbitMQ connection established`);

            connection.on('error', function(e) {
                logger.error('rabbit connection error');
            });
            connection.on('close', function(e) {
                logger.error('rabbit connection close');
            });

            return connection;
        } catch (e) {
            logger.error('catched creating rabbit connection ' + e);
        }
    }

    /**
     * Creates a channel and queue.
     */
    async consumeMessages() {
        try {
            const channel = this.channel = await this.connection.createChannel();
            const queueName = this.queueName;
            const queue = await channel.assertQueue(queueName, { durable: true });

            logger.info(`Incoming queue: ${JSON.stringify(queue)}`);

            channel.prefetch(this.prefetchCount, false);

            channel.consume(queueName, this.handleMessage.bind(this), { noAck: true });
        } catch (e) {
            logger.error('catched in message consumer - ' + e);
        }
    }

    /**
     * Message handler
     * @param {Object} msg - RabbitMQ incoming message.
     */
    async handleMessage(msg) {
        logger.info('=>> MESSAGE ', JSON.stringify(msg.properties), msg.content);
        const corrId = msg.properties.correlationId;
        const callbackQ = msg.properties.replyTo;
        let message;

        try {
            message = JSON.parse(msg.content);
        } catch (e) {
            logger.error('Message body contains invalid json');
            return;
        }

        const { scriptName } = message;

        if (!scriptName) {
            logger.error('Script name missed in message body');
            return;
        }

        const result = await execEngine.execute(scriptName);

        if (callbackQ) {
            await this.publishResponse(result, callbackQ, corrId);
        } else {
            logger.warn('Callback queue is not passed. No reply will be published');
        }
    }

    /**
     * Message handler
     * @param {Object} body - outcoming message content.
     * @param {string} callbackQ - name of queue to reply.
     * @param {string} [corrId] - correlation id of incoming message. Optional.
     */
    publishResponse(body, callbackQ, corrId) {
        const msg = JSON.stringify(body);

        this.channel.sendToQueue(
            callbackQ,
            Buffer.from(msg),
            { persistent: true, correlationId: corrId }
        );
        logger.info(`<<= RESPONSE PUBLISHED TO`, callbackQ);
    }
}

module.exports = new RabbitClient();
