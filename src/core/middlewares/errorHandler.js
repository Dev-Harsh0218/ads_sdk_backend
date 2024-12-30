//custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

//error Handler Middleware
const errorHandler = (err,req,res,next) => {
    //Default to a 500 internal server error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    
    //consoling the error

    res.status(statusCode).json({
        success: false,
        error:{
            message,
            statusCode
        },
    });
}

module.exports = {AppError, errorHandler}