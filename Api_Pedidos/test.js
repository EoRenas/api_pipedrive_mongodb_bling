require('dotenv').config();
const { sendToBling } = require('./src/services/blingService');

const exemplo = {
  id: Math.floor(Math.random() * 100000),
  title: 'Pedido Teste Renan',
  value: 150.75,
  person_name: 'Teste 11:08',
  email: 'renan@email.com',
  phone: '11999999999'
};

async function testar() {
  try {
    console.log('🚀 Iniciando teste de envio de pedido...');
    await sendToBling(exemplo);
    console.log('\n✅ Pedido enviado com sucesso!\n');
  } catch (err) {
    console.error('❌ Erro durante o teste:', err.message);
    if (err.response) {
      console.error('📄 Detalhes do erro:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

testar();
