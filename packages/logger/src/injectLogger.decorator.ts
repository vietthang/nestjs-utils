import { Inject } from '@nestjs/common'
import { FactoryProvider } from '@nestjs/common/interfaces'
import { createLogger, Logger, LoggerOptions } from 'winston'
import { LOGGER_CONFIG_SYMBOL } from './common'

const prefix = '___LOGGER'

export const injectProviders: FactoryProvider[] = []

export const loggers: { [key: string]: Logger } = {}

export function InjectLogger(name: string): MethodDecorator {
  return () => {
    const key = [prefix, name].join('__')
    injectProviders.push({
      provide: key,
      useFactory(options: LoggerOptions): Logger {
        const logger = createLogger(options)
        if (loggers[name]) {
          throw new Error(`logger with name "${name}" already existed`)
        }
        loggers[name] = logger
        return logger
      },
      inject: [LOGGER_CONFIG_SYMBOL],
    })
    Inject(key)
  }
}
