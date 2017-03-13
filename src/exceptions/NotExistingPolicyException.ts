class NotExistingPolicyException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'NotExistingPolicyException';
    }
}

export default NotExistingPolicyException;