import {Moment} from "moment";

interface IRiskTracker {
    [riskName: string]: {validFrom : Moment, validTill : Moment};
}

export default IRiskTracker;