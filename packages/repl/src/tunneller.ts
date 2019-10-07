import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Application, NextFunction, Request, Response } from 'express'
import proxy from 'http-proxy-middleware'

export const PROXY_CONFIG_SYMBOL = Symbol('ProxyConfig')

@Injectable()
export class Tunneller implements OnModuleInit {
  constructor(
    @Inject(HttpAdapterHost)
    private readonly adapterHost: HttpAdapterHost<ExpressAdapter>,
    @Inject(PROXY_CONFIG_SYMBOL)
    @Optional()
    private readonly proxyConfig?: proxy.Config,
  ) {}

  public onModuleInit() {
    const server: Application = this.adapterHost.httpAdapter.getInstance()
    server.stack.unshift(this.handle.bind)
  }

  public handle(req: Request, res: Response, next: NextFunction): void {
    const debugTunnelHost = req.header('x-debug-tunnel')
    if (debugTunnelHost) {
      proxy(debugTunnelHost, this.proxyConfig)(req, res, next)
      return
    }

    next()
  }
}
