/**
 * Centralized logging utility using Winston
 * Provides structured logging with different transports for dev/prod
 */

const winston = require("winston");

const { combine, timestamp, errors, json, colorize, printf, splat } =
  winston.format;

// Custom format to redact sensitive information from logs
// Prevents API keys, tokens, passwords, and other secrets from being logged
const redactSensitive = winston.format((info) => {
  const sensitiveFields = [
    'authorization',
    'password',
    'token',
    'api_key',
    'apiKey',
    'apikey',
    'secret',
    'jwt',
    'bearer',
    'cookie',
    'session',
    'firebase_service_account',
    'GEMINI_API_KEY',
    'BREVO_API_KEY',
    'DATABASE_URL',
    'FIREBASE_SERVICE_ACCOUNT',
    'private_key',
  ];

  // Helper function to redact sensitive data recursively
  const redactObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key of Object.keys(redacted)) {
      const lowerKey = key.toLowerCase();

      // Check if key matches sensitive field patterns
      const isSensitive = sensitiveFields.some(field =>
        lowerKey.includes(field.toLowerCase())
      );

      if (isSensitive && redacted[key]) {
        redacted[key] = '[REDACTED]';
      } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
        redacted[key] = redactObject(redacted[key]);
      }
    }

    return redacted;
  };

  // Redact sensitive data from the log info object
  if (info.metadata) {
    info.metadata = redactObject(info.metadata);
  }

  // Redact from additional fields that might contain sensitive data
  const fieldsToCheck = ['headers', 'req', 'request', 'body', 'query', 'params', 'env'];
  for (const field of fieldsToCheck) {
    if (info[field]) {
      info[field] = redactObject(info[field]);
    }
  }

  return info;
});

// Custom format for development
const devFormat = printf(({ level, message, timestamp, service, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  if (Object.keys(metadata).length > 0 && metadata.stack === undefined) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  if (metadata.stack) {
    msg += `\n${metadata.stack}`;
  }

  return msg;
});

// Determine log level from environment
const level =
  process.env.LOG_LEVEL ||
  (process.env.NODE_ENV === "production" ? "info" : "debug");

// Create transports based on environment
const transports = [];

if (process.env.NODE_ENV === "production") {
  // Production: JSON format for log aggregation services
  transports.push(
    new winston.transports.Console({
      format: combine(
        redactSensitive(),
        timestamp(),
        errors({ stack: true }),
        splat(),
        json(),
      ),
    }),
  );
} else {
  // Development: Colorized, human-readable output
  transports.push(
    new winston.transports.Console({
      format: combine(
        redactSensitive(),
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        errors({ stack: true }),
        splat(),
        devFormat,
      ),
    }),
  );
}

// Create logger instance
const logger = winston.createLogger({
  level,
  defaultMeta: { service: "campusiq-api" },
  transports,
  // Don't exit on unhandled errors
  exitOnError: false,
});

// Create a child logger with additional context
logger.child = (metadata) => {
  return winston.createLogger({
    level,
    defaultMeta: { service: "campusiq-api", ...metadata },
    transports,
    exitOnError: false,
  });
};

module.exports = logger;
