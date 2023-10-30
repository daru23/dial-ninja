import { findISOCountryCode, isMobileNumber } from "./index";
import {expect} from "chai";

require("dotenv").config()

describe("find ISO Country Codes", () => {

    it("gets The Netherlands country code", async () => {
        const isoCountryCode = findISOCountryCode("31");

        // Check the captured logs
        expect(isoCountryCode).to.be.equal("NL");
    });

    it("gets Venezuela country code", async () => {
        const isoCountryCode = findISOCountryCode("58");

        // Check the captured logs
        expect(isoCountryCode).to.be.equal("VE");
    });

    it("gets unknown country code", async () => {
        const isoCountryCode = findISOCountryCode("12345");

        // Check the captured logs
        expect(isoCountryCode).to.be.equal("");
    });
});

describe("is phone number a mobile number", () => {

    it("it is a dutch mobile number", async () => {
        const isDutchMobileNumber = isMobileNumber("0652221447");

        // Check the captured logs
        expect(isDutchMobileNumber).to.be.true;
    });

    it("is not a dutch mobile number", async () => {
        const isDutchMobileNumber = isMobileNumber("0752221447");

        // Check the captured logs
        expect(isDutchMobileNumber).to.be.false;
    });
});
