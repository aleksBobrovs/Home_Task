import Risk from './types/Risk';
import IInsuranceCompany from './interfaces/IInsuranceCompany';
import IPolicy from "./interfaces/IPolicy";
import {Moment} from "moment";
import moment = require("moment");
import PolicyFactory from "./PolicyFactory";
import SoldPolicyRecord from "./SoldPolicyRecord";
import IRiskTracker from "./interfaces/IRiskTracker";
import ObjectWithGivenNameInThatTimePeriodAlreadyExistException from "./exceptions/ObjectWithGivenNameInThatTimePeriodAlreadyExistException";
import ValidFromDateIsInThePastException from "./exceptions/ValidFromDateIsInThePastException";
import UnavailableRiskException from "./exceptions/UnavailableRiskException";
import ValidTillDateShouldNotBeLessThanValidFromDateException from "./exceptions/ValidTillDateShouldNotBeLessThanValidFromDateException";
import DuplicateRiskException from "./exceptions/DuplicateRiskException";
import StringMap from "./interfaces/IStringMap";
import NotExistingRiskException from "./exceptions/NotExistingRiskException";
import InvalidMonthsAmountException from "./exceptions/InvalidMonthsAmountException";
import NegativeYearlyPriceException from "./exceptions/NegativeYearlyPriceException";
import RiskPriceCalculatorByMonths from "./RiskPriceCalculatorByMonths";
import IRiskPriceCalculator from "./interfaces/IRiskPriceCalculator";
import NotExistingPolicyException from "./exceptions/NotExistingPolicyException";

class InsuranceCompany implements IInsuranceCompany {

    private _name : string;
    private _availableRisks : Risk[];
    private soldPoliciesList : SoldPolicyRecord[];

    constructor(name : string) {
        this._name = name;
        this._availableRisks = [];
        this.soldPoliciesList = [];
    }

    get name() : string {
        return this._name;
    }

    get availableRisks() : Risk[] {
        return this._availableRisks;
    }

    set availableRisks(risksList : Risk[]) {
        this.validateAvailableRisks(risksList);
        this._availableRisks = risksList;
    }

    public sellPolicy(nameOfInsuredObject: string, validFrom: Moment, validMonths: number, selectedRisks: Risk[]): IPolicy {
        this.validateNewPolicy(nameOfInsuredObject, validFrom, validMonths, selectedRisks);
        let validTill : Moment = validFrom.clone().add(validMonths, "months"),
            premium : number = this.calculateInitialPremium(selectedRisks, validFrom, validTill),

            newPolicy : IPolicy = PolicyFactory.getInstance()
                .createPolicy(nameOfInsuredObject, validFrom, validTill, selectedRisks, premium);

        this.soldPoliciesList.push(new SoldPolicyRecord(newPolicy));

        return newPolicy;
    }

    public addRisk(nameOfInsuredObject: string, risk: Risk, validFrom: Moment): void {
        let policy : IPolicy = this.getPolicyByEffectiveDate(nameOfInsuredObject, validFrom),
            policyRecord = this.getSoldPolicyRecordByEffectiveDate(nameOfInsuredObject, validFrom);

        this.validateNewRisk(risk, validFrom, policy);

        policyRecord.riskTracker[risk.name] = {
            validFrom : validFrom,
            validTill : policy.validTill
        };

        let riskPriceCalculator : IRiskPriceCalculator = new RiskPriceCalculatorByMonths;
        policy.premium += riskPriceCalculator.calculate(risk, validFrom, policy.validTill);

        policy.insuredRisks.push(risk);
    }

    public removeRisk(nameOfInsuredObject: string, risk: Risk, validTill: Moment): void {
        let policy : IPolicy = this.getPolicyByEffectiveDate(nameOfInsuredObject, validTill),
            policyRecord : SoldPolicyRecord = this.getSoldPolicyRecordByEffectiveDate(nameOfInsuredObject, validTill),
            riskTracker : IRiskTracker = policyRecord.riskTracker;

        this.validateRemovableRisk(risk, validTill, policy, riskTracker);

        policyRecord.riskTracker[risk.name].validTill = validTill;
        policy.premium = this.recalculatePremium(policy, policyRecord);
    }

    public getPolicy(nameOfInsuredObject: string, effectiveDate: Moment): IPolicy {
        let policy : IPolicy = this.getPolicyByEffectiveDate(nameOfInsuredObject, effectiveDate),
            policyRecord = this.getSoldPolicyRecordByEffectiveDate(nameOfInsuredObject, effectiveDate),
            riskTracker : IRiskTracker = policyRecord.riskTracker;

        let activeRisks : Risk[] =
            policy.insuredRisks
                .filter((risk : Risk) => effectiveDate.isBefore(riskTracker[risk.name].validTill))
                .filter((risk : Risk) => effectiveDate.isAfter(riskTracker[risk.name].validFrom));

        policy.insuredRisks = activeRisks;

        return policy;
    }

    public getAllSoldPolicies() : IPolicy[] {
        return this.soldPoliciesList
            .map((soldPolicyRecord : SoldPolicyRecord) => soldPolicyRecord.soldPolicy);
    }

    private calculateInitialPremium(riskList : Risk[], validFrom : Moment, validTill : Moment) : number {
        let riskPriceCalculator : IRiskPriceCalculator = new RiskPriceCalculatorByMonths,
            premium : number = 0;

        riskList.forEach((risk: Risk) => {
            premium += riskPriceCalculator.calculate(risk, validFrom, validTill);
        });

        return premium;
    }

    private recalculatePremium(policy : IPolicy, policyRecord : SoldPolicyRecord) : number {
        let premium : number = 0,
            riskPriceCalculator : IRiskPriceCalculator = new RiskPriceCalculatorByMonths;

        policy.insuredRisks.forEach((risk : Risk) => {
            premium += riskPriceCalculator.calculate(
                risk, policyRecord.riskTracker[risk.name].validFrom, policyRecord.riskTracker[risk.name].validTill);
        });

        return premium;
    }

    private getPolicyByEffectiveDate(nameOfInsuredObject : string, effectiveDate : Moment) : IPolicy {
        let filteredPoliciesList : IPolicy[] =
            this.getAllSoldPolicies()
                .filter((policy : IPolicy) : boolean => policy.nameOfInsuredObject === nameOfInsuredObject)
                .filter((policy : IPolicy) : boolean => effectiveDate.isBetween(policy.validFrom, policy.validTill));

        if (!filteredPoliciesList[0]) throw new NotExistingPolicyException(
            "Policy with that name does not exist in that time period");

        return filteredPoliciesList[0];
    }

    private getSoldPolicyRecordByEffectiveDate(nameOfInsuredObject: string, effectiveDate: Moment) : SoldPolicyRecord {
        let filteredSoldPolicies : SoldPolicyRecord[] = this.soldPoliciesList
            .filter((soldPolicyRecord : SoldPolicyRecord) => soldPolicyRecord.soldPolicy.nameOfInsuredObject === nameOfInsuredObject)
            .filter((soldPolicyRecord : SoldPolicyRecord) => effectiveDate.isBetween(soldPolicyRecord.soldPolicy.validFrom, soldPolicyRecord.soldPolicy.validTill));

        return filteredSoldPolicies[0];
    }

    private checkIfObjectWithNameAlreadyExistInTimePeriod(nameOfInsuredObject: string, validFrom: Moment, validMonths: number) : void {

        let validTill : Moment = validFrom.clone().add(validMonths, "months");
        let filteredSoldPolicies : IPolicy[] = this.getAllSoldPolicies()
            .filter((policy : IPolicy) => policy.nameOfInsuredObject === nameOfInsuredObject)
            .filter((policy : IPolicy) => validFrom.isBetween(policy.validFrom, policy.validTill) ||
                validTill.isBetween(policy.validFrom, policy.validTill));

        if (filteredSoldPolicies.length > 0) throw new ObjectWithGivenNameInThatTimePeriodAlreadyExistException(
            `There is already insured object with ${nameOfInsuredObject} name in given period`);
    }

    private checkIfValidFromDateIsValid(validFrom: Moment, errorMessage : string) : void {
         if (validFrom.isBefore(moment().startOf("day"))) throw new
             ValidFromDateIsInThePastException(errorMessage);
    }

    private checkIfSelectedRisksAreAvailable(riskList : Risk[]) : void {
        let filteredRiskList : Risk[] = riskList
            .filter((risk : Risk) => this._availableRisks.indexOf(risk) === -1);

        if (filteredRiskList.length > 0) throw new UnavailableRiskException(
            "Risk which you want to add is unavailable");
    }

    private checkIfRiskListHaveDuplicates(riskList : Risk[], errorMessage : string) : void {
        let riskNameList : string[] = riskList.map((risk : Risk) => risk.name),
            counts : StringMap<number> = {};

        for(let i : number = 0; i <= riskNameList.length; i++) {
            if(counts[riskNameList[i]] === undefined) {
                counts[riskNameList[i]] = 1;
            } else {
                throw new DuplicateRiskException(errorMessage);
            }
        };
    }

    private checkIfRisksHavePositiveYearlyPrice(riskList : Risk[], errorMessage : string) : void {
        let filteredRiskYearlyPriceList : number[] = riskList.map((risk : Risk) => risk.yearlyPrice)
            .filter((yearlyPrice : number) => yearlyPrice < 0);

        if (filteredRiskYearlyPriceList.length > 0) throw new NegativeYearlyPriceException(errorMessage);
    }

    private validateAvailableRisks(riskList : Risk[]) : void {
        this.checkIfRiskListHaveDuplicates(riskList, "Risks list should not have duplicates");
        this.checkIfRisksHavePositiveYearlyPrice(riskList, "Risk yearly price should not be negative");
    }

    private validateNewPolicy(nameOfInsuredObject: string, validFrom: Moment, validMonths: number, selectedRisks: Risk[]) : void {
        this.checkIfObjectWithNameAlreadyExistInTimePeriod(nameOfInsuredObject, validFrom, validMonths);
        this.checkIfValidFromDateIsValid(validFrom, "Policy validFrom date should not be in the past");
        this.checkIfSelectedRisksAreAvailable(selectedRisks);
        if (validMonths <= 0) throw new InvalidMonthsAmountException("Valid months should be greater than 0");
    }

    private validateNewRisk(risk : Risk, validFrom : Moment, policy : IPolicy) {
        this.checkIfValidFromDateIsValid(validFrom, "Risk validFrom date should not be in the past");
        this.checkIfSelectedRisksAreAvailable([risk]);
        this.checkIfRiskListHaveDuplicates(policy.insuredRisks.concat([risk]), "Risks list should not have duplicates");
    }

    private validateRemovableRisk(risk : Risk, validTill : Moment, policy : IPolicy, riskTracker : IRiskTracker) {
        let riskNameList : string[] = policy.insuredRisks
            .map((risk : Risk) => risk.name);

        if (riskNameList.indexOf(risk.name) === -1) throw new NotExistingRiskException(
            "Risk which you try to remove does not exist on this insured object");

        if (validTill.isBefore(riskTracker[risk.name].validFrom))throw new
            ValidTillDateShouldNotBeLessThanValidFromDateException(
            "Valid till date is lesser than valid from date");
    }
}

export default InsuranceCompany;
