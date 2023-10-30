const amqplib = require('amqplib');

// Load environment variables from .env file
require('dotenv').config();

const MIN = 10000000000;
const MAX = 999999999999;

/**
 * Returns a random number between ten billion and nine hundred ninety-nine billion,
 * nine hundred ninety-nine million, nine hundred ninety-nine thousand, nine hundred ninety-nine
 */
export function numberGenerator (): number {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

/**
 * Sends a number to the processor queue
 * @param n
 */
export async function sendToProcessor (n: number) {
    try{
        // Configuring rabbitmq and establishing the connection
        const queueProcessor = 'processor';
        const rabbitUser = process.env.RABBITMQ_USER
        const rabbitPassword = process.env.RABBITMQ_PASS
        const rabbitmqConnection = `amqp://${rabbitUser}:${rabbitPassword}@rabbitmq`
        const conn = await amqplib.connect(rabbitmqConnection);
        const channel = await conn.createChannel();

        console.log(`Sending a number to be processed: ${n}`);

        // Sending message to the queue
        await channel.sendToQueue(queueProcessor, Buffer.from(`${n}`));

    } catch (error) {
        console.log(error)
    }

}

// Always running sendToProcessor when this script is called
(async () => {
    try {
        await sendToProcessor(numberGenerator());
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();

