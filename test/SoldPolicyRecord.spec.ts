import {Moment} from "moment";
import moment = require("moment");
import Risk from "../src/types/Risk";
import IPolicy from "../src/interfaces/IPolicy";
import PolicyFactory from "../src/PolicyFactory";
import SoldPolicyRecord from "../src/SoldPolicyRecord";


describe("Sold policy record tests", () => {

    it("should when initialized, save all risks of policy to risk tracker", () => {
        let policyFactory : PolicyFactory = PolicyFactory.getInstance(),
            nameOfInsuredObject : string = "Car",
            validFrom : Moment = moment("2017-04-01"),
            validTill : Moment = moment("2018-04-01"),
            riskList : Risk[] = [
                {
                    name: "Sold policy record risk",
                    yearlyPrice : 100
                }
            ],
            premium : number = 100,
            policy : IPolicy = policyFactory.createPolicy(nameOfInsuredObject, validFrom, validTill, riskList, premium),
            soldPolicyRecord : SoldPolicyRecord = new SoldPolicyRecord(policy);

            expect(soldPolicyRecord.riskTracker["Sold policy record risk"].validFrom).toBe(validFrom);
            expect(soldPolicyRecord.riskTracker["Sold policy record risk"].validTill).toBe(validTill);
    });
});