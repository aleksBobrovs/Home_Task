import InsuranceCompany from '../src/InsuranceCompany';
import Risk from "../src/types/Risk";
import PolicyFactory from "../src/PolicyFactory";;
import {Moment} from "moment";
import moment = require("moment");
import IPolicy from "../src/interfaces/IPolicy";
import ObjectWithGivenNameInThatTimePeriodAlreadyExistException from "../src/exceptions/ObjectWithGivenNameInThatTimePeriodAlreadyExistException";
import ValidFromDateIsInThePastException from "../src/exceptions/ValidFromDateIsInThePastException";
import UnavailableRiskException from "../src/exceptions/UnavailableRiskException";
import ValidTillDateShouldNotBeLessThanValidFromDateException from "../src/exceptions/ValidTillDateShouldNotBeLessThanValidFromDateException";
import DuplicateRiskException from "../src/exceptions/DuplicateRiskException";
import NotExistingRiskException from "../src/exceptions/NotExistingRiskException";
import InvalidMonthsAmountException from "../src/exceptions/InvalidMonthsAmountException";
import NegativeYearlyPriceException from "../src/exceptions/NegativeYearlyPriceException";
import NotExistingPolicyException from "../src/exceptions/NotExistingPolicyException";
import IRiskPriceCalculator from "../src/interfaces/IRiskPriceCalculator";
import RiskPriceCalculatorByMonths from "../src/RiskPriceCalculatorByMonths";

describe("Name property tests : ", () => {
    let insuranceCompany : InsuranceCompany;

    it("should get name of insurance company", () => {
        insuranceCompany = new InsuranceCompany("If");
        expect(insuranceCompany.name).toBe("If");
    });
});

describe("Available risks list related tests : ", () => {
    let insuranceCompany : InsuranceCompany,
        availableRisks : Risk[];

    const risk : Risk = {
        name : "Hurricane",
        yearlyPrice : 100
    };

    beforeEach(() => {
        insuranceCompany = new InsuranceCompany("If");
        availableRisks = [];
    });

    it("should get empty list of available risks", () => {
       expect(insuranceCompany.availableRisks.length).toBe(0);
    });

    it("should get list of available risks if there are more than one", () => {

        availableRisks.push(risk);
        insuranceCompany.availableRisks = availableRisks;

        expect(insuranceCompany.availableRisks.length).toBe(1);
    });

    it("should get empty list of available risks, if it were setted to empty array", () => {
        let emptyAvailableRisksList : Risk[] = [];

        availableRisks.push(risk);
        insuranceCompany.availableRisks = availableRisks;
        insuranceCompany.availableRisks = emptyAvailableRisksList;

        expect(insuranceCompany.availableRisks.length).toBe(0);
    });

    it("should not allow to have two risks with same name in available risk list", () => {
        let availableRiskListWithDuplicate : Risk[] = [risk, risk];

        expect(() => insuranceCompany.availableRisks = availableRiskListWithDuplicate)
            .toThrow(new DuplicateRiskException("Risks list should not have duplicates"));
    });

    it("should not allow to add risks with negative yearly price", () => {
        let risk = {name: "NegativeRisk", yearlyPrice: -1},
            availableRiskListWithDuplicate : Risk[] = [risk];

        expect(() => insuranceCompany.availableRisks = availableRiskListWithDuplicate)
            .toThrow(new NegativeYearlyPriceException(
                "Risk yearly price should not be negative"));
    });
});

describe("Policy related tests : ", () => {
    let insuranceCompany : InsuranceCompany,
        availableRisks : Risk[],
        policyValidFrom : Moment,
        policyValidMonths: number,
        selectedRiskList: Risk[],
        risk1 : Risk = {name : "Hurricane", yearlyPrice: 100},
        risk2 : Risk = {name : "High Voltage", yearlyPrice: 150},
        risk3 : Risk = {name: "Explosion", yearlyPrice: 200};

    const nameOfInsuredObject : string = "Car";

    beforeEach(() => {
        insuranceCompany = new InsuranceCompany("If");
        insuranceCompany.availableRisks = [risk1, risk2, risk3];
        selectedRiskList = [];
    });

    it("should be able to sell policy with initial list of risks", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskPriceCalculator : IRiskPriceCalculator = new RiskPriceCalculatorByMonths;

        let policyValidTill : Moment = policyValidFrom.clone().add(policyValidMonths, "months"),
            premium : number = 0;

        selectedRiskList.forEach((risk: Risk) => {
            premium += riskPriceCalculator.calculate(risk, policyValidFrom, policyValidTill);
        });

        let newPolicy : IPolicy = PolicyFactory
            .getInstance()
            .createPolicy(nameOfInsuredObject, policyValidFrom, policyValidTill, selectedRiskList, premium);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let effectiveDate : Moment;
        effectiveDate = policyValidFrom.clone().add(6, "months");

        expect(insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate)).toEqual(newPolicy);
   });

    it("should add risks within policy period", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);
        
        let riskValidFrom : Moment = policyValidFrom.clone().add(1, "months");

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);
        insuranceCompany.addRisk(nameOfInsuredObject, risk3, riskValidFrom);

        let effectiveDate : Moment;
        effectiveDate = policyValidFrom.clone().add(1, "months");

        let carPolicy : IPolicy = insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate),
            policyRiskList : Risk[] = carPolicy.insuredRisks;

        expect(policyRiskList.length).toBe(3);
    });

    it("should remove risks within policy period", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskValidTill : Moment = policyValidFrom.clone().add(1, "days");

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);
        insuranceCompany.removeRisk(nameOfInsuredObject, risk2, riskValidTill);

        let effectiveDate : Moment = policyValidFrom.clone().add(1, "months"),
            carPolicy : IPolicy = insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate),
            policyRiskList : Risk[] = carPolicy.insuredRisks;

        expect(policyRiskList.length).toBe(1);
    });

    it("should allow to add two policies with same insured object at different periods", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let anotherPolicyValidFrom = policyValidFrom.clone().add(2, "years");

        insuranceCompany.sellPolicy(nameOfInsuredObject, anotherPolicyValidFrom, policyValidMonths, selectedRiskList);

        expect(insuranceCompany.getAllSoldPolicies().length).toBe(2);

    });

    it("should get policy with risks active at given time", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskValidFrom : Moment = policyValidFrom.clone().add(3, "months");

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);
        insuranceCompany.addRisk(nameOfInsuredObject, risk3, riskValidFrom);

        let effectiveDate : Moment = policyValidFrom.clone().add(2, "months");

        let carPolicy : IPolicy = insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate),
            policyRiskList : Risk[] = carPolicy.insuredRisks;

        expect(policyRiskList.length).toBe(2);
    });

    it("should throw error if policy does exist, but not in given time period", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let effectiveDate : Moment = policyValidFrom.clone().add(2, "years");

        expect(() => insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate)).toThrow(
            new NotExistingPolicyException("Policy with that name does not exist in that time period"));
    });

    it("should throw error if policy does not exist", () => {
        let effectiveDate : Moment = moment().startOf("day");

        expect(() => insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate)).toThrow(
            new NotExistingPolicyException("Policy with that name does not exist in that time period"));
    });

    it("should throw error if add risk to not existing policy", () => {
        let riskValidFrom : Moment = moment().startOf("day");

        expect(() => insuranceCompany.addRisk(nameOfInsuredObject, risk3, riskValidFrom))
            .toThrow(new NotExistingPolicyException("Policy with that name does not exist in that time period"));
    });

    it("should throw error if remove risk from not existing policy", () => {
        let riskValidTill : Moment = moment().startOf("day");

        expect(() => insuranceCompany.removeRisk(nameOfInsuredObject, risk3, riskValidTill))
            .toThrow(new NotExistingPolicyException("Policy with that name does not exist in that time period"));
    });

    it("should throw error if add policy and in its validity period already exist one with same insured object", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let anotherPolicyValidFrom = policyValidFrom.clone().add(3, "months");

        expect(() => insuranceCompany.sellPolicy(
            nameOfInsuredObject, anotherPolicyValidFrom, policyValidMonths, selectedRiskList))
            .toThrow(new ObjectWithGivenNameInThatTimePeriodAlreadyExistException(
                `There is already insured object with ${nameOfInsuredObject} name in given period`));
    });

    it("should throw error if create policy with validFrom date in the past", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().add(-2, "days");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        expect(() => insuranceCompany.sellPolicy(
            nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList))
            .toThrow(new ValidFromDateIsInThePastException(
                `Policy validFrom date should not be in the past`));
    });

    it("should throw error if select risk list, and there are unavailable risks in it", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        insuranceCompany.availableRisks = [risk1];

        expect(() => insuranceCompany.sellPolicy(
            nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList))
            .toThrow(new UnavailableRiskException(
                "Risk which you want to add is unavailable"));
    });

    it("should throw error if add risk, if it is unavailable", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskValidFrom : Moment = policyValidFrom.clone().add(1, "day");

        insuranceCompany.availableRisks = [risk1, risk2];
        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        expect(() => insuranceCompany.addRisk(nameOfInsuredObject, risk3, riskValidFrom))
            .toThrow(new UnavailableRiskException(
                "Risk which you want to add is unavailable"));
    });

    it("should throw error if added risk has duplicate name", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskValidFrom : Moment = policyValidFrom.clone().add(1, "day");

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        expect(() => insuranceCompany.addRisk(nameOfInsuredObject, risk2, riskValidFrom))
            .toThrow(new DuplicateRiskException("Risks list should not have duplicates"));
    });

    it("should throw error if remove risk with validTill date before its validFrom date", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskValidFrom : Moment = policyValidFrom.clone().add(3, "days"),
            riskValidTill : Moment = riskValidFrom.clone().add(-1, "days");

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);
        insuranceCompany.addRisk(nameOfInsuredObject, risk3, riskValidFrom);

        expect(() => insuranceCompany.removeRisk(nameOfInsuredObject, risk3, riskValidTill))
            .toThrow(new ValidTillDateShouldNotBeLessThanValidFromDateException(
                "Valid till date is lesser than valid from date"));
    });

    it("should throw error if remove not existing risk", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        let riskValidFrom : Moment = policyValidFrom.clone().add(3, "days"),
            riskValidTill : Moment = riskValidFrom.clone().add(3, "days");

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        expect(() => insuranceCompany.removeRisk(nameOfInsuredObject, risk3, riskValidTill))
            .toThrow(new NotExistingRiskException(
                "Risk which you try to remove does not exist on this insured object"));
    });

    it("should throw error if valid months is 0", () => {
        policyValidMonths = 0;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        expect(() => insuranceCompany.sellPolicy(
            nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList))
            .toThrow(new InvalidMonthsAmountException("Valid months should be greater than 0"));
    });

    it("should throw error if valid months is less than 0", () => {
        policyValidMonths = -1;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        expect(() => insuranceCompany.sellPolicy(
            nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList))
            .toThrow(new InvalidMonthsAmountException("Valid months should be greater than 0"));
    });
});

describe("Premium calculation related tests : ", () => {

    let insuranceCompany : InsuranceCompany,
        policyValidFrom : Moment,
        policyValidMonths: number,
        selectedRiskList: Risk[],
        risk1 : Risk = {name : "Hurricane", yearlyPrice: 100},
        risk2 : Risk = {name : "High Voltage", yearlyPrice: 150},
        risk3 : Risk = {name: "Explosion", yearlyPrice: 150};

    const nameOfInsuredObject : string = "Car";

    beforeEach(() => {
        insuranceCompany = new InsuranceCompany("If");
        insuranceCompany.availableRisks = [risk1, risk2, risk3];
        selectedRiskList = [];
    });

    it("should calculate premium when new policy added", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let effectiveDate : Moment;
        effectiveDate = policyValidFrom.clone().add(1, "days");

        let carPolicy : IPolicy = insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate),
            policyPremium : number = carPolicy.premium;

        let expectedPremium = risk1.yearlyPrice + risk2.yearlyPrice;

        expect(policyPremium).toBe(expectedPremium);

    });

    it("should recalculate premium when new risk added", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2]);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let effectiveDate : Moment = policyValidFrom.clone().add(2, "months"),
            riskValidFrom : Moment = policyValidFrom.clone().add(3, "months");

        insuranceCompany.addRisk(nameOfInsuredObject, risk3, riskValidFrom);

        let updatedPremiumPolicy : IPolicy = insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate),
            expectedPremium : number = 362.5;

        expect(updatedPremiumPolicy.premium).toBe(expectedPremium);
    });

    it("should recalculate premium when new risk removed", () => {
        policyValidMonths = 12;
        policyValidFrom = moment().startOf("day");
        selectedRiskList = selectedRiskList.concat([risk1, risk2, risk3]);

        insuranceCompany.sellPolicy(nameOfInsuredObject, policyValidFrom, policyValidMonths, selectedRiskList);

        let effectiveDate : Moment = policyValidFrom.clone().add(2, "months"),
            riskValidTill : Moment = policyValidFrom.clone().add(3, "months");

        insuranceCompany.removeRisk(nameOfInsuredObject, risk3, riskValidTill);

        let updatedPremiumPolicy : IPolicy = insuranceCompany.getPolicy(nameOfInsuredObject, effectiveDate),
            expectedPremium : number = 287.5;

        expect(updatedPremiumPolicy.premium).toBe(expectedPremium);
    });
});

