/**
 * HTTP Request/Response logging middleware
 * Logs every incoming request and outgoing response with timing data.
 *
 * Log format (dev):
 *   --> GET /api/users 
 *   <-- GET /api/users 200 12ms
 *
 * Sensitive headers (Authorization, Cookie) are automatically redacted.
 */

const logger = require('../utils/logger');

/**
 * List of headers to include in request logs.
 * Authorization and cookie values are redacted by the logger's redactSensitive format.
 */
const LOGGED_REQ_HEADERS = [
  'host',
  'user-agent',
  'content-type',
  'content-length',
  'accept',
  'origin',
  'referer',
  'x-forwarded-for',
  'x-request-id',
  'authorization',
];

/**
 * Pick only the headers we care about from the incoming request.
 */
function pickHeaders(headers) {
  const picked = {};
  for (const key of LOGGED_REQ_HEADERS) {
    if (headers[key]) {
      picked[key] = headers[key];
    }
  }
  return picked;
}

/**
 * Determine the log level based on HTTP status code.
 *   2xx → info,  3xx → info,  4xx → warn,  5xx → error
 */
function levelForStatus(status) {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'info';
}

/**
 * Express middleware — mount BEFORE routes.
 *
 * Usage:
 *   const { requestLogger } = require('./middleware/requestLogger');
 *   app.use(requestLogger);
 */
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();   // nanosecond precision

  // Generate a short request ID for correlating req ↔ res lines
  const reqId = Math.random().toString(36).substring(2, 8);
  req.reqId = reqId;

  // ── Incoming request log ──────────────────────────────────────────
  const reqMeta = {
    reqId,
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.socket?.remoteAddress,
    headers: pickHeaders(req.headers),
  };

  // Log body for mutating methods (but cap size to avoid huge payloads)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const bodyStr = JSON.stringify(req.body);
    reqMeta.body = bodyStr.length > 2048
      ? JSON.parse(bodyStr.substring(0, 2048) + '…[truncated]')
      : req.body;
  }

  // Log query params if present
  if (req.query && Object.keys(req.query).length > 0) {
    reqMeta.query = req.query;
  }

  logger.info(`--> ${req.method} ${req.originalUrl || req.url}`, reqMeta);

  // ── Outgoing response log (fires when response finishes) ──────────
  const originalEnd = res.end;

  res.end = function (chunk, encoding) {
    // Restore original end so it only fires once
    res.end = originalEnd;
    res.end(chunk, encoding);

    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs / 1_000_000n);

    const status = res.statusCode;
    const logLevel = levelForStatus(status);

    const resMeta = {
      reqId,
      method: req.method,
      url: req.originalUrl || req.url,
      status,
      durationMs,
      contentLength: res.getHeader('content-length') || '-',
    };

    // Attach userId if auth middleware already set it
    if (req.user?.uid) {
      resMeta.userId = req.user.uid;
    }

    logger[logLevel](
      `<-- ${req.method} ${req.originalUrl || req.url} ${status} ${durationMs}ms`,
      resMeta,
    );
  };

  next();
}

module.exports = { requestLogger };
