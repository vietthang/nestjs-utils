import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets'
import repl from 'repl'
import { Socket } from 'socket.io'
import stream from 'stream'

declare module 'socket.io' {
  export interface Socket {
    replServer?: repl.REPLServer
  }
}

export class ReplGatewayConfig {
  // version:
}

@WebSocketGateway({ namespace: '/repl' })
export class ReplGateway implements OnGatewayConnection, OnGatewayDisconnect {
  public handleConnection(socket: Socket) {
    const inStream = new stream.Readable()
    const outStream = new stream.Writable({
      write: (chunk, encoding, callback) => {
        socket.emit('terminal-out', chunk, encoding, callback)
      },
    })

    socket.on('terminal-in', data => inStream.push(data))

    const replServer = repl.start({
      prompt: '> ',
      input: inStream,
      output: outStream,
      useGlobal: false,
      useColors: true,
      replMode: repl.REPL_MODE_STRICT,
    })

    replServer.defineCommand('', text => replServer.write(text))

    socket.replServer = replServer
  }

  public handleDisconnect(socket: Socket) {
    if (socket.replServer) {
      socket.replServer.close()
    }
  }
}
