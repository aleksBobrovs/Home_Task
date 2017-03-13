import IPolicy from "./interfaces/IPolicy";
import Risk from "./types/Risk";
import {Moment} from "moment";

class Policy implements IPolicy {

    private _nameOfInsuredObject: string;
    private _validFrom: Moment;
    private _validTill: Moment;
    private _premium: number;
    private _insuredRisks: Risk[];
    private test : string[];

    get nameOfInsuredObject() : string {
        return this._nameOfInsuredObject;
    }

    set nameOfInsuredObject(name : string) {
        this._nameOfInsuredObject = name;
    }

    get insuredRisks(): Risk[] {
        return this._insuredRisks;
    }

    set insuredRisks(risk: Risk[]) {
        this._insuredRisks = risk;
    }

    get premium(): number {
        return this._premium;
    }

    set premium(premium: number) {
        this._premium = premium;
    }

    get validTill(): Moment {
        return this._validTill;
    }

    set validTill(validTill: Moment) {
        this._validTill = validTill;
    }
    get validFrom(): Moment {
        return this._validFrom;
    }

    set validFrom(validFrom: Moment) {
        this._validFrom = validFrom;
    }

}

export default Policy;