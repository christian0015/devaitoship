export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export function log(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.log(`[${timestamp}] [${level}] ${message}`, meta);
  } else {
    console.log(`[${timestamp}] [${level}] ${message}`);
  }
}

export const info = (message: string, meta?: any) => log(LogLevel.INFO, message, meta);
export const warn = (message: string, meta?: any) => log(LogLevel.WARN, message, meta);
export const error = (message: string, meta?: any) => log(LogLevel.ERROR, message, meta);
