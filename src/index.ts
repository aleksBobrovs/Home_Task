//Just playround
import InsuranceCompany from "./InsuranceCompany";
import Risk from "./types/Risk";
import {Moment} from "moment";
import moment = require("moment");

let ifCom : InsuranceCompany = new InsuranceCompany("if");

const nameOfInsuredObject : string = "Car",
    risk1 : Risk = {
        name : "Hurricane",
        yearlyPrice: 100,
    },
    risk2 : Risk = {
        name : "High Voltage",
        yearlyPrice: 150,
    },
    risk3 : Risk = {
        name : "High Voltage2",
        yearlyPrice: 150,
    }

let validFrom : Moment,
    validMonths: number = 12,
    riskList: Risk[] = [];

validFrom = moment("2017-04-01", "YYYY-MM-DD", true);
riskList.push(risk1);
riskList.push(risk2);
riskList.push(risk3);

ifCom.availableRisks = [risk1, risk2, risk3];


ifCom.sellPolicy(nameOfInsuredObject, validFrom, validMonths, riskList);

let riskValidFrom : Moment = moment("2017-07-02", "YYYY-MM-DD", true);

ifCom.removeRisk(nameOfInsuredObject, risk3, riskValidFrom);

validFrom = moment("2019-04-02", "YYYY-MM-DD", true);

