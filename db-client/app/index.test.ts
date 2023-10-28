import {savePhoneNumber} from "./index";
import {expect} from "chai";
import {MongoMemoryServer} from "mongodb-memory-server";

require("dotenv").config()

describe("Save records in the database", () => {
    let mongoServer: MongoMemoryServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        process.env.MONGO_URI = mongoServer.getUri();
    });

    after(async () => {
        await mongoServer.stop();
    });

    it("successfully save document", async () => {
        const data = {"isoCode": "", "countryCode": 55, "number": 6603350360, "isMobile": false};
        const savedDocument = await savePhoneNumber(data);

        // Check the captured logs
        expect(savedDocument).to.equal(true);
    });
});
