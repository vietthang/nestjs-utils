import { Context } from '@nestjs-utils/common'
import winston from 'winston'
import { TypedKey } from '../../common/src/context'

export interface Logger {
  error(context: Context, message: string, meta?: unknown): void
  warn(context: Context, message: string, meta?: unknown): void
  info(context: Context, message: string, meta?: unknown): void
  verbose(context: Context, message: string, meta?: unknown): void
  debug(context: Context, message: string, meta?: unknown): void
  silly(context: Context, message: string, meta?: unknown): void
}

interface LoggersConfig {
  clientId?: string
  levels: { [key: string]: string | undefined }
}

export const LoggersContextKey: TypedKey<LoggersConfig> = 'loggers'

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
        const config = (context as Context).value(LoggersContextKey)
        const contextLevel = (config && config.levels[this.name]) || 'info'
        const clientId = config && config.clientId
        const { level } = info
        if (this.logger.levels[contextLevel] > this.logger.levels[level]) {
          return false
        }

        return { ...info, module: name, clientId }
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
