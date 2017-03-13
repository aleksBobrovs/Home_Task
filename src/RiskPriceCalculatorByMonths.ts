import Risk from "./types/Risk";
import {Moment} from "moment";
import IRiskPriceCalculator from "./interfaces/IRiskPriceCalculator";

class RiskPriceCalculatorByMonths implements IRiskPriceCalculator{

    calculate(risk : Risk, validFrom : Moment, validTill : Moment) : number {
        return risk.yearlyPrice / 12 * validTill.diff(validFrom, "months");
    }

}

export default RiskPriceCalculatorByMonths;