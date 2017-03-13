import PolicyFactory from "../src/PolicyFactory";
import IPolicy from "../src/interfaces/IPolicy";
import {Moment} from "moment";
import moment = require("moment");
import Risk from "../src/types/Risk";

describe("Policy Factory related tests : ", () => {

    it("should not return null when trying to get instance of policy factory", () => {
        let policyFactory : PolicyFactory = PolicyFactory.getInstance();
        expect(policyFactory).toBeTruthy();
    });

    it("should create policy with passed arguments", () => {
        let policyFactory : PolicyFactory = PolicyFactory.getInstance(),
            nameOfInsuredObject : string = "Car",
            validFrom : Moment = moment("2017-04-01"),
            validTill : Moment = moment("2018-04-01"),
            riskList : Risk[] = [
                {
                    name: "Factory risk",
                    yearlyPrice : 100
                }
            ],
            premium : number = 100;

        let policy : IPolicy = policyFactory.createPolicy(nameOfInsuredObject, validFrom, validTill, riskList, premium);

        expect(policy.nameOfInsuredObject).toBe(nameOfInsuredObject);
        expect(policy.validFrom).toBe(validFrom);
        expect(policy.insuredRisks).toBe(riskList);
        expect(policy.validTill).toBe(validTill);
        expect(policy.premium).toBe(premium);
    });
});