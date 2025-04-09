const Order = require('../models/order');

async function saveOrderToMongo(deal) {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split('T')[0]; // YYYY-MM-DD

  const order = new Order({
    date: dataFormatada,
    value: deal.value,
    title: deal.title,
    client: deal.person_name || 'Cliente sem nome'
  });

  try {
    await order.save();
    console.log(`✅ Pedido salvo no MongoDB para ${order.client}`);
  } catch (err) {
    console.error('❌ Erro ao salvar no MongoDB:', err.message);
  }
}

module.exports = saveOrderToMongo;
