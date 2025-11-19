"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthInfoService = exports.DatabaseError = exports.NotFoundError = exports.ValidationError = void 0;
const utils_1 = require("../../shared/utils");
/** Error types for better control & observability */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class DatabaseError extends Error {
    /** Optional original error for diagnostics */
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'DatabaseError';
    }
}
exports.DatabaseError = DatabaseError;
/** Heuristics to detect DB connection-level errors across common ORMs/drivers */
function isDbConnectionError(err) {
    const code = err?.code;
    const name = String(err?.name ?? '');
    const msg = String(err?.message ?? '').toLowerCase();
    // Typical Node/driver codes
    const netCodes = ['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH', 'ECONNRESET'];
    if (typeof code === 'string' && netCodes.includes(code))
        return true;
    // Common ORM error class names
    const ormNames = [
        'SequelizeConnectionRefusedError',
        'SequelizeConnectionError',
        'PrismaClientInitializationError',
        'PrismaClientRustPanicError',
        'MongoNetworkError',
        'MongooseServerSelectionError',
    ];
    if (ormNames.some((n) => name.includes(n)))
        return true;
    // Message hints
    if (msg.includes('connection') ||
        msg.includes('connect') ||
        msg.includes('pool is closed') ||
        msg.includes('server selection') ||
        msg.includes('database is locked')) {
        return true;
    }
    return false;
}
/** Validate numeric user id: positive integer */
function assertValidUserId(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new ValidationError('Invalid userId: must be a positive integer');
    }
}
class AuthInfoService {
    constructor(repo, logger = console // default to console if no logger injected
    ) {
        this.repo = repo;
        this.logger = logger;
    }
    /**
     * Get public user info by id:
     * - Validate input
     * - Handle DB connection issues explicitly
     * - Log access & errors for observability
     */
    async execute(userId) {
        // 1) Input validation
        try {
            assertValidUserId(userId);
        }
        catch (e) {
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
            return (0, utils_1.sanitizeUser)(user);
        }
        catch (err) {
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
exports.AuthInfoService = AuthInfoService;
