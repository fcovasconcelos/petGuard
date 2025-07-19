const WebSocket = require('ws');

let wss;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
  });
}

function broadcastAlerta(alerta) {
  if (!wss) return;

  const data = JSON.stringify({ tipo: 'alerta', alerta });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

module.exports = { setupWebSocket, broadcastAlerta };
