import { Inject } from '@nestjs/common'
import { FactoryProvider } from '@nestjs/common/interfaces'
import { createLogger, Logger, LoggerOptions } from 'winston'
import { LOGGER_CONFIG_SYMBOL } from './common'

const prefix = '___LOGGER'

export const registeredProviders: FactoryProvider[] = []

export function InjectLogger(
  nameOrClass?: string | (new (...args: any[]) => any),
  options?: LoggerOptions,
) {
  const name =
    nameOrClass && typeof nameOrClass === 'function'
      ? nameOrClass.name
      : nameOrClass
  const key = [prefix, name].join('__')
  registeredProviders.push({
    provide: key,
    useFactory(defaultOptions?: LoggerOptions): Logger {
      return createLogger({
        ...defaultOptions,
        ...options,
        defaultMeta: {
          ...(defaultOptions && defaultOptions.defaultMeta),
          ...(options && options.defaultMeta),
          tag: name,
        },
      })
    },
    inject: [LOGGER_CONFIG_SYMBOL],
  })
  return Inject(key)
}
