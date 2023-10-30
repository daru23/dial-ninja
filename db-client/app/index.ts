const amqplib = require("amqplib");
const mongoose = require("mongoose");

// Load environment variables from .env file
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

/*
  Types
 */
interface Message {
    content: string;
}

interface PhoneNumber {
    isoCode: string,
    countryCode: number,
    number: number,
    isMobile: boolean
}

/*
  Database Models
 */
const PhoneNumber = mongoose.model("PhoneNumber", {
    isoCode: String,
    countryCode: Number,
    number: Number,
    isMobile: Boolean
});

/**
 * savePhoneNumber insert a record in the database
 * @param document
 */

export async function savePhoneNumber(document: PhoneNumber) {
    try {
        const phoneNumber = new PhoneNumber({...document});
        await phoneNumber.save()
        console.log("Saved");

        return true;

    } catch (error) {
        console.log(error);
    }

}

(async () => {
    try {
        const queueStore = "store";
        const rabbitmqConnection = process.env.RABBITMQ_URI
        const conn = await amqplib.connect(rabbitmqConnection);
        const channel = await conn.createChannel();
        await channel.assertQueue(queueStore);

        // Listening to the queueStore
        channel.consume(queueStore, (msg: Message | null) => {
            if (msg === null) {
                console.log("Empty message received in the queue.");
                return;
            }

            console.log("Received:", msg.content.toString());
            // Acknowledging the message and proceed to save the record in the database
            channel.ack(msg);
            const document = JSON.parse(msg.content)
            savePhoneNumber(document);
        });

    } catch (error) {
        console.log(error);
    }

})();
