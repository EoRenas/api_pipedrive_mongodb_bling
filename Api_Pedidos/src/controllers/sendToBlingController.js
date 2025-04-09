const Opportunity = require('../models/opportunity');
const { sendToBling } = require('../services/blingService');

async function sendAllToBling(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Opportunity.findOne({ date: today });

    if (!record || record.opportunities.length === 0) {
      return res.status(404).json({ error: 'Nenhuma oportunidade encontrada para hoje.' });
    }

    let successCount = 0;
    let failCount = 0;

    for (const deal of record.opportunities) {
      const response = await sendToBling(deal);
      if (response?.retorno?.erros) {
        console.error('Erro do Bling:', response.retorno.erros);
        failCount++;
      } else {
        successCount++;
      }
    }

    res.json({
      message: 'Processo concluído',
      enviados: successCount,
      falhas: failCount
    });

  } catch (error) {
    console.error('Erro ao enviar oportunidades ao Bling:', error.message);
    res.status(500).json({ error: 'Erro ao enviar para o Bling.' });
  }
}

module.exports = { sendAllToBling };
