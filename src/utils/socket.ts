import { Server as HttpServer } from 'http'
import socketio, { Server } from 'socket.io'

let io: Server

export default {
  init: (server: HttpServer): Server => {
    io = socketio(server)
    return io
  },
  getIo: (): Server => io,
}
