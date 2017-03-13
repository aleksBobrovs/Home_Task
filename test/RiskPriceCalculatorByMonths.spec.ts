import RiskPriceCalculatorByMonths from "../src/RiskPriceCalculatorByMonths";
import IRiskPriceCalculator from "../src/interfaces/IRiskPriceCalculator";
import {Moment} from "moment";
import moment = require("moment");
import Risk from "../src/types/Risk";

describe("Risk price calculator by months tests : ", () => {
    let riskPriceCalculator : IRiskPriceCalculator,
        validFrom : Moment;

    beforeEach(() => {
        riskPriceCalculator = new RiskPriceCalculatorByMonths();
        validFrom = moment().startOf("day")
    });

    it("should calculate risk price with 1 year time period", () => {
        let validTill : Moment = validFrom.clone().add(1, "year"),
            risk : Risk = {name : "Risk to calculate", yearlyPrice : 1000},
            expectedPrice = 1000,
            riskPrice = riskPriceCalculator.calculate(risk, validFrom, validTill);

       expect(riskPrice).toBe(expectedPrice);
    });

    it("should calculate risk price with more than 1 year time period", () => {
        let validTill : Moment = validFrom.clone().add(2, "year"),
            risk : Risk = {name : "Risk to calculate", yearlyPrice : 1000},
            expectedPrice = 2000,
            riskPrice = riskPriceCalculator.calculate(risk, validFrom, validTill);

        expect(riskPrice).toBe(expectedPrice);
    });

    it("should calculate risk price with less than 1 year time period", () => {
        let validTill : Moment = validFrom.clone().add(6, "months"),
            risk : Risk = {name : "Risk to calculate", yearlyPrice : 1000},
            expectedPrice = 500,
            riskPrice = riskPriceCalculator.calculate(risk, validFrom, validTill);

        expect(riskPrice).toBe(expectedPrice);
    });
});