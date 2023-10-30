const amqplib = require('amqplib');

// Load environment variables from .env file
require('dotenv').config();

interface Message {
    content: string;
}

interface PhoneNumber {
    isoCode: string,
    countryCode: number,
    number: number,
    isMobile: boolean
}

export function createPhoneNumber(inputString: string): PhoneNumber | null {
    try {
        const parsedNumber: number = parseInt(inputString);

        if (10000000000 <= parsedNumber && parsedNumber <= 999999999999) {
            const countryCode = parseInt(inputString.substring(0, 2));
            const pNumber = parseInt(inputString.substring(2));
            const isoCode = findISOCountryCode(countryCode);
            let isMobile = false;

            // For now we can only know from Dutch phone numbers
            if (isoCode == "NL") {
                isMobile = isMobileNumber(pNumber.toString())
            }
            return {
                isoCode: isoCode,
                countryCode: countryCode,
                number: pNumber,
                isMobile: isMobile
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return null; // Return NaN to indicate an error
    }

}

export function findISOCountryCode(countryCode: number): string {
    // For now we only support The Netherlands (NL)
    return countryCode == 31 ? "NL" : "";
}

export function isMobileNumber(phoneNumber: string): boolean {
    // For now we only support The Netherlands (NL) mobile number format
    const accessDigit = phoneNumber.substring(0, 2);

    return accessDigit == "06";
}

export function numberProcessor(inputString: string): PhoneNumber | null {
    try {
        const phoneNumber = createPhoneNumber(inputString);
        if (!phoneNumber) {
            return null;
        }
        return <PhoneNumber>phoneNumber;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function sendToDatabase (phoneNumber: PhoneNumber) {
    try {
        const queueStore = 'store';
        const rabbitUser = process.env.RABBITMQ_USER
        const rabbitPassword = process.env.RABBITMQ_PASS
        const rabbitmqConnection = `amqp://${rabbitUser}:${rabbitPassword}@rabbitmq`
        const conn = await amqplib.connect(rabbitmqConnection);

        const channel = await conn.createChannel();
        const jsonString = JSON.stringify(phoneNumber);
        const msg = `sending phone number to be store in database: ${jsonString}`;
        console.log(msg);

        await channel.sendToQueue(queueStore, Buffer.from(jsonString));
    } catch (error) {
        console.log(error)
    }

};

(async () => {
    const queueProcessor = 'processor';
    // TODO create a method to connect to rabbitmq to not repeat this code
    const rabbitUser = process.env.RABBITMQ_USER
    const rabbitPassword = process.env.RABBITMQ_PASS
    const rabbitmqConnection = `amqp://${rabbitUser}:${rabbitPassword}@rabbitmq`
    const conn = await amqplib.connect(rabbitmqConnection);

    const channel = await conn.createChannel();
    await channel.assertQueue(queueProcessor);

    // Listener
    channel.consume(queueProcessor, (msg: Message | null) => {
        if (msg !== null) {
            const input = msg.content.toString();

            console.log('Received:', input);
            // acknowledging the message to take it out of the queue
            channel.ack(msg);

            console.log('Processing:', input);

            const phoneNumber = numberProcessor(input);

            if (!phoneNumber) {
                console.log(`Input ${input} is not a valid phone number.`);
                return;
            }

            // if phone number is valid we pass t to the next queue
            sendToDatabase(<PhoneNumber>phoneNumber);


        } else {
            console.log('Consumer cancelled by server');
        }
    });

})();
