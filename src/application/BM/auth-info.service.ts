// auth-info.service.ts
import { AuthRepository } from '../../domain/BM/bm-repos/auth.irepo';
import { PublicUser } from '../dtos/public-user.dto';
import { sanitizeUser } from '../../shared/utils';

/** Error types for better control & observability */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
export class DatabaseError extends Error {
  /** Optional original error for diagnostics */
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/** Minimal logger interface (compatible with console or winston/pino) */
export type Logger = {
  info?(msg: string, meta?: any): void;
  warn?(msg: string, meta?: any): void;
  error?(msg: string, meta?: any): void;
};

/** Heuristics to detect DB connection-level errors across common ORMs/drivers */
function isDbConnectionError(err: any): boolean {
  const code = err?.code;
  const name = String(err?.name ?? '');
  const msg = String(err?.message ?? '').toLowerCase();

  // Typical Node/driver codes
  const netCodes = ['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH', 'ECONNRESET'];
  if (typeof code === 'string' && netCodes.includes(code)) return true;

  // Common ORM error class names
  const ormNames = [
    'SequelizeConnectionRefusedError',
    'SequelizeConnectionError',
    'PrismaClientInitializationError',
    'PrismaClientRustPanicError',
    'MongoNetworkError',
    'MongooseServerSelectionError',
  ];
  if (ormNames.some((n) => name.includes(n))) return true;

  // Message hints
  if (
    msg.includes('connection') ||
    msg.includes('connect') ||
    msg.includes('pool is closed') ||
    msg.includes('server selection') ||
    msg.includes('database is locked')
  ) {
    return true;
  }

  return false;
}

/** Validate numeric user id: positive integer */
function assertValidUserId(userId: number): void {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ValidationError('Invalid userId: must be a positive integer');
  }
}

export class AuthInfoService {
  constructor(
    private repo: AuthRepository,
    private logger: Logger = console // default to console if no logger injected
  ) {}

  /**
   * Get public user info by id:
   * - Validate input
   * - Handle DB connection issues explicitly
   * - Log access & errors for observability
   */
  async execute(userId: number): Promise<PublicUser> {
    // 1) Input validation
    try {
      assertValidUserId(userId);
    } catch (e) {
      this.logger?.warn?.('Invalid userId provided', { userId });
      throw e;
    }

    // 2) Query & robust error handling
    try {
      const user = await this.repo.getUserById(userId);

      if (!user) {
        this.logger?.info?.('User not found', { userId });
        throw new NotFoundError('User not found');
      }

      this.logger?.info?.('User fetched for access', { userId });
      return sanitizeUser(user);
    } catch (err: any) {
      if (isDbConnectionError(err)) {
        this.logger?.error?.('Database connection issue in AuthInfoService.execute', {
          userId,
          err,
        });
        // Wrap to a stable error type so upstream can decide retry/fallback
        throw new DatabaseError('Database connection error', err);
      }

      // Unexpected error: still log and rethrow to keep original semantics
      this.logger?.error?.('Unexpected error in AuthInfoService.execute', {
        userId,
        err,
      });
      throw err;
    }
  }
}
