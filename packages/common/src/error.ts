export interface AppErrorOptions {
  code?: string
  status?: number
  message?: string
  origin?: Error
  extra?: unknown
}

export function formatErrorToJSON(error: unknown): unknown {
  if (error instanceof AppError) {
    return {
      code: error.code,
      httpCode: error.status,
      message: error.message,
      stack: error.stack,
      origin: error.origin ? formatErrorToJSON(error) : undefined,
      extra: error.extra,
    }
  }

  if (error instanceof Error) {
    return {
      code: 'INTERNAL_ERROR',
      httpCode: 500,
      message: error.message,
      stack: error.message,
    }
  }

  return {
    code: 'INTERNAL_ERROR',
    httpCode: 500,
    message: 'unknown error',
  }
}

export class AppError extends Error {
  public readonly code: string

  public readonly status: number

  public readonly origin?: Error

  public readonly extra?: unknown

  constructor({
    code = 'UNKNOWN_ERROR',
    status = 500,
    message = code,
    origin,
    extra,
  }: AppErrorOptions = {}) {
    super(message)

    this.code = code
    this.status = status
    this.origin = origin
    this.extra = extra
  }

  public toJSON() {
    return formatErrorToJSON(this)
  }
}
