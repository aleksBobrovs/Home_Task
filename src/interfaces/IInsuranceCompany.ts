import Risk from '../types/Risk';
import IPolicy from "./IPolicy";
import {Moment} from "moment";

interface IInsuranceCompany {

    name : string;

    availableRisks : Risk[];

    sellPolicy(nameOfInsuredObject : string, validFrom : Moment, validMonths : number, selectedRisks : Risk[]) : IPolicy;

    addRisk(nameOfInsuredObject : string, risk : Risk, validFrom : Moment) : void;

    removeRisk(nameOfInsuredObject : string, risk : Risk, validTill : Moment) : void;

    getPolicy(nameOfInsuredObject : string, effectiveDate : Moment) : IPolicy;

}

export default IInsuranceCompany;