class SpecifiedError extends Error {
    constructor(props) {
        super();
        if (props && props.reason) {
            this.reason = props.reason;
        }
    }
}

module.exports = { SpecifiedError };
