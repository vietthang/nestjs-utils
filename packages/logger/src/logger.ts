import {
  ClientIdContextKey,
  Context,
  RequestIdContextKey,
  RequestTimeContextKey,
  TypedKey,
} from '@nestjs-utils/common'
import winston from 'winston'

export interface Logger {
  error(context: Context, message: string, meta?: unknown): void
  warn(context: Context, message: string, meta?: unknown): void
  info(context: Context, message: string, meta?: unknown): void
  verbose(context: Context, message: string, meta?: unknown): void
  debug(context: Context, message: string, meta?: unknown): void
  silly(context: Context, message: string, meta?: unknown): void
}

interface LoggersConfig {
  levels: { [key: string]: string | undefined }
}

export const LoggersContextKey = 'loggers' as TypedKey<LoggersConfig>

export class WinstonLogger implements Logger {
  private readonly logger: winston.Logger

  constructor(
    private readonly name: string,
    options: winston.LoggerOptions = {},
  ) {
    this.logger = winston.createLogger({
      ...options,
      level: 'silly',
      format: winston.format(({ context, ...info }) => {
        const ctx: Context = context
        const config = ctx.value(LoggersContextKey)
        const contextLevel = (config && config.levels[this.name]) || 'info'
        const { level } = info
        if (this.logger.levels[contextLevel] < this.logger.levels[level]) {
          return false
        }

        const clientId = ctx.value(ClientIdContextKey)
        const requestId = ctx.value(RequestIdContextKey)
        const requestTime = ctx.value(RequestTimeContextKey)

        return { ...info, module: name, clientId, requestId, requestTime }
      })(),
    })
  }

  public error(context: Context, message: string, meta?: unknown): void {
    this.logger.error(message, { ...meta, context })
  }
  public warn(context: Context, message: string, meta?: unknown): void {
    this.logger.warn(message, { ...meta, context })
  }
  public info(context: Context, message: string, meta?: unknown): void {
    this.logger.info(message, { ...meta, context })
  }
  public verbose(context: Context, message: string, meta?: unknown): void {
    this.logger.verbose(message, { ...meta, context })
  }
  public debug(context: Context, message: string, meta?: unknown): void {
    this.logger.debug(message, { ...meta, context })
  }
  public silly(context: Context, message: string, meta?: unknown): void {
    this.logger.silly(message, { ...meta, context })
  }
}
