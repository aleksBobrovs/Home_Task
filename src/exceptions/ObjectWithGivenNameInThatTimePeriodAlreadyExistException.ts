class ObjectWithGivenNameInThatTimePeriodAlreadyExistException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'ObjectWithGivenNameInThatTimePeriodAlreadyExistException';
    }
}

export default ObjectWithGivenNameInThatTimePeriodAlreadyExistException;