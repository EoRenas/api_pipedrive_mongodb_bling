const { enviarPedidosParaBling } = require('../controllers/pedidosController');
const express = require('express');
const router = express.Router();

const {
  syncOpportunities,
  getConsolidatedOpportunities
} = require('../controllers/opportunityControllers');

const { sendAllToBling } = require('../controllers/sendToBlingController');

// Rotas existentes
router.get('/sync', syncOpportunities);
router.get('/consolidado', getConsolidatedOpportunities);

// Rota para cadastrar os contatos no Bling
router.post('/enviar-bling', sendAllToBling);

// ✅ Agora sim: Rota POST para enviar pedidos de vendas ao Bling
router.post('/enviar-pedidos', enviarPedidosParaBling);

module.exports = router;
