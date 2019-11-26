import { DynamicModule, Module } from '@nestjs/common'
import proxy from 'http-proxy-middleware'
import { HOST_CONFIG_SYMBOL, PROXY_CONFIG_SYMBOL, Tunneller } from './tunneller'

export interface TunnellerModuleOptions {
  host: string
  proxy?: proxy.Config
}

@Module({})
export class TunnellerModule {
  public static forRoot(options: TunnellerModuleOptions): DynamicModule {
    return {
      module: TunnellerModule,
      providers: [
        Tunneller,
        { provide: PROXY_CONFIG_SYMBOL, useValue: options.proxy },
        { provide: HOST_CONFIG_SYMBOL, useValue: options.host },
      ],
    }
  }
}
