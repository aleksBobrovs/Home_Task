class ValidTillDateShouldNotBeLessThanValidFromDateException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'ValidTillDateShouldNotBeLessThanValidFromDateException';
    }
}

export default ValidTillDateShouldNotBeLessThanValidFromDateException;