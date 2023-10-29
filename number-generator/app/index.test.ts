import { numberGenerator } from "./index";
import {expect} from "chai";

require("dotenv").config()

describe("Generates a random number between 10000000000 and nine hundred 999999999999", () => {

    it("successfully save document", async () => {
        const n = numberGenerator();

        // Check the captured logs
        expect(n).to.be.a('number');
        expect(n).to.be.above(10000000000);
        expect(n).to.be.below(999999999999);
    });
});
