import { Context } from '@nestjs-utils/common'
import { Injectable } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import winston from 'winston'
import { InjectLogger, Logger, LoggerModule } from './index'

describe('e2e', () => {
  @Injectable()
  class TestService {
    constructor(
      @InjectLogger(TestService)
      public readonly logger: Logger,
    ) {}

    public hello(): void {
      this.logger.info(Context.background, 'Hello')
      this.logger.debug(Context.background, 'Hello')
    }
  }

  it('should be ok', async () => {
    const transport = new winston.transports.Console()
    const logSpy = jest.spyOn(transport, 'log')
    const module = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          transports: [transport],
        }),
      ],
      providers: [TestService],
      exports: [TestService],
    }).compile()

    const testService = module.get(TestService)
    expect(testService).toBeDefined()
    expect(testService.logger).toBeDefined()
    testService.hello()
    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy.mock.calls[0][0]).toMatchObject({
      level: 'info',
      message: 'Hello',
      module: 'TestService',
    })
    expect(typeof logSpy.mock.calls[0][1]).toBe('function')
  })
})
