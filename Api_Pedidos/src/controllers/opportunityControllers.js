
const { getWonDeals } = require('../services/pipedriveService');
const Opportunity = require('../models/opportunity');
const moment = require('moment');

async function syncOpportunities(req, res) {
  try {
    const deals = await getWonDeals();
    const today = moment().format('YYYY-MM-DD');
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

    const existing = await Opportunity.findOne({ date: today });

    if (existing) {
      existing.opportunities = deals;
      existing.totalValue = totalValue;
      await existing.save();
    } else {
      await Opportunity.create({
        date: today,
        totalValue,
        opportunities: deals
      });
    }

    res.json({ message: 'Sincronização concluída com sucesso.' });
  } catch (error) {
    console.error('Erro na sincronização:', error.message);
    res.status(500).json({ error: 'Erro ao sincronizar oportunidades.' });
  }
}

async function getConsolidatedOpportunities(req, res) {
  try {
    const all = await Opportunity.find();
    res.json(all);
  } catch (error) {
    console.error('Erro ao buscar consolidados:', error.message);
    res.status(500).json({ error: 'Erro ao buscar oportunidades consolidadas.' });
  }
}

module.exports = {
  syncOpportunities,
  getConsolidatedOpportunities
};
