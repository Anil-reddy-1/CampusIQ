/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */

const logger = require('../utils/logger');
const response = require('../utils/response');
const { AppError, ValidationError } = require('../utils/errors');
const config = require('../config/env');

/**
 * Handle 404 - Route not found
 */
function notFoundHandler(req, res, next) {
    return response.error(res, {
        message: `Route ${req.method} ${req.path} not found`,
        statusCode: 404,
        code: 'ROUTE_NOT_FOUND',
    });
}

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
    // Default error values
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let errors = null;

    // Handle operational errors (known errors)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        code = err.code;
        message = err.message;

        if (err instanceof ValidationError) {
            errors = err.errors;
        }
    }
    // Handle Joi validation errors
    else if (err.isJoi) {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        errors = err.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
        }));
    }
    // Handle auth errors
    else if (typeof err.code === 'string' && err.code.startsWith('auth/')) {
        statusCode = 401;
        code = err.code;
        message = getAuthErrorMessage(err.code);
    }
    // Handle JSON parsing errors
    else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        statusCode = 400;
        code = 'INVALID_JSON';
        message = 'Invalid JSON in request body';
    }

    // Log the error
    const logContext = {
        code,
        statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: req.user?.uid,
    };

    if (statusCode >= 500) {
        logger.error(err.message, { ...logContext, stack: err.stack });
    } else {
        logger.warn(err.message, logContext);
    }

    // Don't expose internal error details in production
    if (statusCode === 500 && config.isProduction()) {
        message = 'An unexpected error occurred';
        errors = null;
    }

    return response.error(res, {
        message,
        statusCode,
        code,
        errors,
    });
}

/**
 * Map auth error codes to user-friendly messages
 */
function getAuthErrorMessage(code) {
    const messages = {
        'auth/id-token-expired': 'Your session has expired. Please sign in again.',
        'auth/id-token-revoked': 'Your session has been revoked. Please sign in again.',
        'auth/invalid-id-token': 'Invalid authentication token.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'User not found.',
    };

    return messages[code] || 'Authentication failed.';
}

module.exports = {
    notFoundHandler,
    errorHandler,
};
