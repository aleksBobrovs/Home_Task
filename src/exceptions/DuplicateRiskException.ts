class DuplicateRiskException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'DuplicateRiskException';
    }
}

export default DuplicateRiskException;