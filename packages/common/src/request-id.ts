import { NextFunction, Request, Response } from 'express'
import { Context, TypedKey } from './context'

declare module 'express' {
  interface Request {
    context?: Context
  }
}

export type ClientId = string & { __requestId: true }

export const ClientIdContextKey = 'clientId' as TypedKey<ClientId>

export interface ClientIdMiddlewareOptions {
  headerName?: string
}

export function clientIdMiddleware({
  headerName = 'x-client-id',
}: ClientIdMiddlewareOptions = {}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const clientId = req.header(headerName)
      if (!clientId) {
        return next()
      }
      const context = req.context || Context.background
      req.context = context.withValue(ClientIdContextKey, clientId)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}

export type RequestId = string & { __requestId: true }

export const RequestIdContextKey = 'requestId' as TypedKey<RequestId>

export interface RequestIdMiddlewareOptions {
  generator?: () => Promise<string> | string
}

async function uuidGenerator() {
  const uuid = await import('uuid')
  return uuid.v4()
}

export function requestIdMiddleware({
  generator = uuidGenerator,
}: RequestIdMiddlewareOptions = {}) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const context = req.context || Context.background
      req.context = context.withValue(RequestIdContextKey, await generator())
      return next()
    } catch (error) {
      return next(error)
    }
  }
}

export const RequestTimeContextKey = 'requestTime' as TypedKey<Date>

export function requestTimeMiddleware() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const context = req.context || Context.background
      req.context = context.withValue(RequestTimeContextKey, new Date())
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
