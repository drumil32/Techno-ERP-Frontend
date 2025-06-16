type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logLevels: Record<string, LogLevel> = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

class Logger {
  private readonly currentLevel: LogLevel;
  private readonly isProduction: boolean;

  constructor() {
    this.currentLevel = (process.env.LOGGER_LEVEL as LogLevel) || logLevels.DEBUG;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private canLog(level: LogLevel): boolean {
    if (this.isProduction && level === 'debug') {
      return false; // Prevent debug logs in production
    }
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.currentLevel);
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (this.canLog(level)) {
      switch (level) {
        case logLevels.DEBUG:
          break;
        case logLevels.INFO:
          break;
        case logLevels.WARN:
          break;
        case logLevels.ERROR:
          break;
        default:
      }
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(logLevels.DEBUG, message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log(logLevels.INFO, message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log(logLevels.WARN, message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log(logLevels.ERROR, message, ...args);
  }
}

const logger = new Logger();

export default logger;
