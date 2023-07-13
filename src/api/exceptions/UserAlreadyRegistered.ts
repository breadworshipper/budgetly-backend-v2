class UserAlreadyRegistered extends Error {
    constructor(message){
        super (message + " is already registered.");

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export {UserAlreadyRegistered};
