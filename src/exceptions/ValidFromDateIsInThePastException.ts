class ValidFromDateIsInThePastException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'ValidFromDateIsInThePastException';
    }
}

export default ValidFromDateIsInThePastException;