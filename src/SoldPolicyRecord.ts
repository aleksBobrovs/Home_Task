import IPolicy from "./interfaces/IPolicy";
import IRiskTracker from "./interfaces/IRiskTracker";
import Risk from "./types/Risk";

class SoldPolicyRecord {

    private _soldPolicy : IPolicy;
    private _riskTracker : IRiskTracker;

    constructor(soldPolicy : IPolicy) {
        this._soldPolicy = soldPolicy;
        this._riskTracker = {};

        this._soldPolicy.insuredRisks.forEach((risk : Risk) => {
           this._riskTracker[risk.name] = {
                validFrom : this._soldPolicy.validFrom,
                validTill : this._soldPolicy.validTill
           };
        });
    }

    get soldPolicy(): IPolicy {
        return this._soldPolicy;
    }

    get riskTracker(): IRiskTracker {
        return this._riskTracker;
    }
}

export default SoldPolicyRecord;