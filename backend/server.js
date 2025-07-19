const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const atividadeFisicaRoutes = require('./routes/atividadeFisicaRoutes');
const localizacaoRoutes = require('./routes/localizacaoRoutes');
const alimentacaoRoutes = require('./routes/alimentacaoRoutes');
const alertaRoutes = require('./routes/alertaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const { setupWebSocket, broadcastAlerta } = require('./websocket');

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/atividade-fisica', atividadeFisicaRoutes);
app.use('/api/localizacoes', localizacaoRoutes);
app.use('/api/alimentacoes', alimentacaoRoutes);
app.use('/api/alertas', (req, res, next) => {
  req.broadcastAlerta = broadcastAlerta;
  next();
}, alertaRoutes);

// Cria servidor HTTP e injeta no WebSocket
const http = require('http');
const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
