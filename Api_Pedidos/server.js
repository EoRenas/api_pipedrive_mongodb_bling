require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const opportunityRoutes = require('./src/routes/opportunityRoutes');
const connectToMongo = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

// Rota principal das oportunidades
app.use('/api/oportunidades', opportunityRoutes);

// Página raiz só pra saber se está rodando
app.get('/', (req, res) => {
  res.send('🚀 API do integrador Bling está no ar!');
});

// Conecta no Mongo e inicia o servidor
connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  });
