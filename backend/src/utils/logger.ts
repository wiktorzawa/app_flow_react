type LogArgs = (string | number | boolean | null | undefined | Error | Record<string, unknown>)[];

export const logger = {
  info: (...args: LogArgs) => console.log('[INFO]', ...args),
  warn: (...args: LogArgs) => console.warn('[WARN]', ...args),
  error: (...args: LogArgs) => console.error('[ERROR]', ...args),
  debug: (...args: LogArgs) => console.debug('[DEBUG]', ...args),
};
