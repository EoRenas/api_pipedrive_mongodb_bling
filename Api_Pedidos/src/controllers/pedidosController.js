const Opportunity = require('../models/opportunity');
const { sendToBling } = require('../services/blingService');

async function enviarPedidosParaBling(req, res) {
  try {
    const oportunidadesConsolidadas = await Opportunity.find();

    for (const doc of oportunidadesConsolidadas) {
      for (const opp of doc.opportunities) {
        // Verificação mínima
        if (!opp.title || !opp.value || !opp.person_name) {
          console.warn('⚠️ Oportunidade ignorada por falta de dados:', opp);
          continue;
        }

        try {
          await sendToBling(opp); // Essa função cuida de criar o contato e enviar o pedido
        } catch (error) {
          console.error(`❌ Erro ao enviar pedido para ${opp.person_name}:`, error.message);
          if (error.response) {
            console.error('🔍 Resposta do Bling:', JSON.stringify(error.response.data, null, 2));
          }
        }
      }
    }

    res.status(200).json({ message: '✅ Todos os pedidos foram enviados ao Bling com sucesso!' });
  } catch (error) {
    console.error('❌ Erro geral ao enviar pedidos:', error.message);
    res.status(500).json({ error: 'Erro ao processar envio de pedidos ao Bling.' });
  }
}

module.exports = {
  enviarPedidosParaBling
};
