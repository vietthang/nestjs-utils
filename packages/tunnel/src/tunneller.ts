import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Application, NextFunction, Request, Response } from 'express'
import proxy from 'http-proxy-middleware'

export const PROXY_CONFIG_SYMBOL = '___nestjs_utils_ProxyConfig'

export const HOST_CONFIG_SYMBOL = '___nestjs_utils_Host'

@Injectable()
export class Tunneller implements OnModuleInit {
  constructor(
    @Inject(HttpAdapterHost)
    private readonly adapterHost: HttpAdapterHost<ExpressAdapter>,
    @Inject(HOST_CONFIG_SYMBOL)
    private readonly host: string,
    @Inject(PROXY_CONFIG_SYMBOL)
    @Optional()
    private readonly proxyConfig?: proxy.Config,
  ) {}

  public onModuleInit() {
    const server: Application = this.adapterHost.httpAdapter.getInstance()
    server.stack.unshift(this.handle.bind)
  }

  public handle(req: Request, res: Response, next: NextFunction): void {
    // TODO add authorization
    const debugProxy = req.header('x-debug-proxy') === 'true'
    if (debugProxy) {
      proxy(this.host, this.proxyConfig)(req, res, next)
      return
    }

    next()
  }
}
