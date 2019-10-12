import { Context } from '@nestjs-utils/common'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import qs from 'querystring'
import { LoggersContextKey } from './logger'

export interface LoggerMiddlewareOptions {
  headerName?: string
}

declare module 'express' {
  interface Request {
    context?: Context
  }
}

// TODO add some kind of authorization here
export function loggerMiddleware({
  headerName = 'x-debug-logger',
}: LoggerMiddlewareOptions): RequestHandler {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      const debugValue = req.header(headerName)
      if (!debugValue) {
        return next()
      }
      const config: { [key: string]: string | undefined } = Object.fromEntries(
        Object.entries(qs.parse(debugValue)).map(([key, value]) => {
          if (Array.isArray(value)) {
            return [key, value[0]]
          } else {
            return [key, value]
          }
        }),
      )
      const { clientId, ...levels } = config
      req.context = (req.context || Context.background).withValue(
        LoggersContextKey,
        {
          clientId,
          levels,
        },
      )
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
