import IPolicy from "./interfaces/IPolicy";
import Policy from "./Policy";
import Risk from "./types/Risk";
import {Moment} from "moment";
import moment = require("moment");


class PolicyFactory {

    private static uniqueInstance : PolicyFactory;

    public static getInstance() : PolicyFactory {
        if (this.uniqueInstance === null || this.uniqueInstance === undefined) {
            this.uniqueInstance = new PolicyFactory();
        }
        return this.uniqueInstance;
    }

    public createPolicy(
        nameOfInsuredObject: string, validFrom: Moment, validTill: Moment, selectedRisks: Risk[], premium : number ) : IPolicy {
        let policy : IPolicy = new Policy;

        policy.premium = premium;
        policy.nameOfInsuredObject = nameOfInsuredObject;
        policy.validFrom = validFrom;
        policy.validTill = validTill;
        policy.insuredRisks = selectedRisks;

        return policy;
    }
}

export default PolicyFactory;