class NotExistingRiskException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'NotExistingRiskException';
    }
}

export default NotExistingRiskException;