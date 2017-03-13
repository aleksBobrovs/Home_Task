class InvalidMonthsAmountException extends Error {
    constructor(message : string) {
        super(message);
        this.message = message;
        this.name = 'InvalidMonthsAmountException';
    }
}

export default InvalidMonthsAmountException;