export type LogCategory = 'SYSTEM' | 'DATA' | 'UI' | 'AUTH' | 'SYNC';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
    timestamp: string;
    category: LogCategory;
    level: LogLevel;
    message: string;
    data?: any;
    context?: string;
}

class LoggerService {
    private logs: LogEntry[] = [];
    private maxLogs = 1000;

    info(category: LogCategory, message: string, data?: any, context?: string) {
        this.log('INFO', category, message, data, context);
    }

    warn(category: LogCategory, message: string, data?: any, context?: string) {
        this.log('WARN', category, message, data, context);
    }

    error(category: LogCategory, message: string, data?: any, context?: string) {
        this.log('ERROR', category, message, data, context);
    }

    private log(level: LogLevel, category: LogCategory, message: string, data?: any, context?: string) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            category,
            level,
            message,
            data,
            context
        };

        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        const prefix = `[${entry.timestamp}] [${entry.category}] [${entry.level}]${context ? ` [${context}]` : ''}`;
        const logMethod = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;

        if (data) {
            logMethod(`${prefix} ${message}`, data);
        } else {
            logMethod(`${prefix} ${message}`);
        }
    }

    getHistory() {
        return this.logs;
    }

    clear() {
        this.logs = [];
    }
}

export const logger = new LoggerService();
