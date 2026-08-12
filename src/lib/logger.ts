/**
 * Server-side logging utility
 * Logs auth failures, rate limits, and other security events
 * NEVER logs sensitive data (passwords, tokens, full emails, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  timestamp: string;
  level: LogLevel;
  service: string;
  event: string;
  userId?: string; // Partial/hashed when possible
  ipAddress?: string;
  details?: Record<string, unknown>;
}

function _sanitizeEmail(email: string): string {
  // Return only domain part: user@example.com → example.com
  const [, domain] = email.split('@');
  return domain || 'unknown-domain';
}

function formatLog(context: LogContext): string {
  const { timestamp, level, service, event, userId, ipAddress, details } = context;
  const parts = [
    `[${timestamp}]`,
    `[${level.toUpperCase()}]`,
    `[${service}]`,
    event,
  ];

  if (userId) parts.push(`userId=${userId}`);
  if (ipAddress) parts.push(`ip=${ipAddress}`);

  if (details && Object.keys(details).length > 0) {
    parts.push(`details=${JSON.stringify(details)}`);
  }

  return parts.join(' ');
}

class Logger {
  private service: string;

  constructor(service: string) {
    this.service = service;
  }

  private log(level: LogLevel, event: string, context?: Omit<LogContext, 'timestamp' | 'level' | 'service' | 'event'>) {
    // Only log in development or if NODE_ENV allows it
    if (process.env.NODE_ENV === 'test') return;

    const logContext: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      event,
      ...context,
    };

    const formatted = formatLog(logContext);

    switch (level) {
      case 'debug':
        if (process.env.DEBUG) {
          // eslint-disable-next-line no-console
          console.debug(formatted);
        }
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(formatted);
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(formatted);
        break;
      case 'error':
        // eslint-disable-next-line no-console
        console.error(formatted);
        break;
    }

    // In production, you could send to external logging service here
    // e.g., Sentry, CloudWatch, Datadog, etc.
  }

  debug(event: string, context?: Omit<LogContext, 'timestamp' | 'level' | 'service' | 'event'>) {
    this.log('debug', event, context);
  }

  info(event: string, context?: Omit<LogContext, 'timestamp' | 'level' | 'service' | 'event'>) {
    this.log('info', event, context);
  }

  warn(event: string, context?: Omit<LogContext, 'timestamp' | 'level' | 'service' | 'event'>) {
    this.log('warn', event, context);
  }

  error(event: string, context?: Omit<LogContext, 'timestamp' | 'level' | 'service' | 'event'>) {
    this.log('error', event, context);
  }

  // Security event logging
  authFailure(reason: string, ipAddress?: string) {
    this.warn('AUTH_FAILURE', {
      details: { reason },
      ipAddress,
    });
  }

  rateLimitHit(identifier: string, limit: number, ipAddress?: string) {
    this.warn('RATE_LIMIT_EXCEEDED', {
      details: { identifier, limit },
      ipAddress,
    });
  }

  csrfViolation(origin: string | null, ipAddress?: string) {
    this.warn('CSRF_VIOLATION', {
      details: { origin: origin || 'missing' },
      ipAddress,
    });
  }

  webhookVerificationFailed(reason: string, ipAddress?: string) {
    this.warn('WEBHOOK_VERIFICATION_FAILED', {
      details: { reason },
      ipAddress,
    });
  }

  dbError(operation: string, error: unknown, ipAddress?: string) {
    this.error('DATABASE_ERROR', {
      details: { operation, errorMessage: error instanceof Error ? error.message : String(error) },
      ipAddress,
    });
  }

  gameAction(action: string, userId: string, gameId: string, ipAddress?: string) {
    this.debug('GAME_ACTION', {
      userId,
      details: { action, gameId },
      ipAddress,
    });
  }
}

export function createLogger(service: string): Logger {
  return new Logger(service);
}

// Export pre-configured loggers
export const authLogger = createLogger('AUTH');
export const rateLimitLogger = createLogger('RATE_LIMIT');
export const gameLogger = createLogger('GAME');
export const webhookLogger = createLogger('WEBHOOK');
export const dbLogger = createLogger('DATABASE');
