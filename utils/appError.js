class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4')?'fail':'error'
        // to log the error stack tree in the error handler(error.stack)
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError