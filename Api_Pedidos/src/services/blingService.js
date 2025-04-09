require('dotenv').config();
const axios = require('axios');
const saveOrderToMongo = require('./saveOrder');

// Cria um contato no Bling
async function criarContato(deal) {
  const contato = {
    nome: deal.person_name || 'Cliente sem nome',
    tipo: 'F',
    situacao: 'A',
    contatos: [
      {
        tipo: 'EMAIL',
        descricao: deal.email || 'sememail@exemplo.com'
      },
      {
        tipo: 'TELEFONE',
        descricao: deal.phone || '11999999999'
      }
    ]
  };

  try {
    const response = await axios.post(
      'https://api.bling.com.br/v3/contatos',
      contato,
      {
        headers: {
          Authorization: `Bearer ${process.env.BLING_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const contatoId = response.data.data.id;
    if (!contatoId) {
      throw new Error('❌ contatoId está indefinido.');
    }

    return contatoId;
  } catch (error) {
    console.error('❌ Erro ao criar contato:', JSON.stringify(error.response?.data || error, null, 2));
    throw error;
  }
}

// Verifica se um pedido com determinado número já existe no Bling
async function pedidoJaExiste(numeroPedido) {
  try {
    const response = await axios.get(
      `https://api.bling.com.br/v3/pedidos/vendas?numero=${numeroPedido}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BLING_ACCESS_TOKEN}`
        }
      }
    );

    return response.data?.data?.length > 0;
  } catch (error) {
    if (error.response?.status === 404) {
      return false; // Pedido não encontrado
    }

    console.error('❌ Erro ao verificar pedido existente:', JSON.stringify(error.response?.data || error, null, 2));
    throw error;
  }
}

// Envia um pedido de venda
async function sendToBling(deal) {
  const numeroUnico = deal.id.toString();

  const existe = await pedidoJaExiste(numeroUnico);
  if (existe) {
    console.log(`⚠️ Pedido com número ${numeroUnico} já existe no Bling. Pulando...`);
    return;
  }

  const contatoId = await criarContato(deal);

  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split('T')[0]; // YYYY-MM-DD

  const pedido = {
    numero: numeroUnico,
    data: dataFormatada,
    contato: {
      id: contatoId
    },
    itens: [
      {
        descricao: deal.title || 'Produto sem nome',
        quantidade: 1,
        valor: deal.value || 0
      }
    ],
    pagamento: {
      forma: 'Dinheiro',
      condicao: 'À vista'
    },
    tipoIntegracao: 'API'
  };

  console.log('📤 Enviando pedido para o Bling...');
  console.log('📦 Pedido montado:', JSON.stringify(pedido, null, 2));

  try {
    const response = await axios.post(
      'https://api.bling.com.br/v3/pedidos/vendas',
      pedido,
      {
        headers: {
          Authorization: `Bearer ${process.env.BLING_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Pedido enviado com sucesso!');
    console.log('🧾 Resposta:', JSON.stringify(response.data, null, 2));

    // Salvar no MongoDB
    await saveOrderToMongo(deal);

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao enviar para o Bling:', error.message);
    if (error.response) {
      console.error('🔍 Status:', error.response.status);
      console.error('📄 Corpo da resposta:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

module.exports = {
  sendToBling,
  pedidoJaExiste
};
