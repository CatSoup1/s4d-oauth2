const WebSocketServer = require("ws")
const wss = new WebSocketServer.Server({ port: 3000 });
console.log("server is online :)")
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});