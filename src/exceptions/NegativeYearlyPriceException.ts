class NegativeYearlyPriceException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'NegativeYearlyPriceException';
    }
}

export default NegativeYearlyPriceException;