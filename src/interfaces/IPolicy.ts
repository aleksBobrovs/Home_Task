import Risk from "../types/Risk";
import {Moment} from "moment";

interface IPolicy {

    nameOfInsuredObject : string;

    validFrom : Moment;

    validTill : Moment;

    premium : number;

    insuredRisks : Risk[];

}

export default IPolicy;
