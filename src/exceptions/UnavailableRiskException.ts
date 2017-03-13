class UnavailableRiskException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'UnavailableRiskException';
    }
}

export default UnavailableRiskException;