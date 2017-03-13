import Risk from "../types/Risk";
import {Moment} from "moment";

interface IRiskPriceCalculator {

    calculate(risk : Risk, validFrom : Moment, validTill : Moment) : number;

}

export default IRiskPriceCalculator;