import 'https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/addons/fit/fit.min.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/addons/fullscreen/fullscreen.min.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/addons/webLinks/webLinks.min.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.slim.js'

const term = new window.Terminal({ cursorBlink: true })

// Open the terminal in #terminal-container
term.open(document.getElementById('terminal'))
term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

window.fullscreen.toggleFullScreen(term)
window.fit.fit(term)
window.webLinks.webLinksInit(term)

const socket = io('/repl')
term.on('data', chunk => socket.emit('terminal-in', chunk))
socket.on('terminal-out', chunk => term.write(chunk))
