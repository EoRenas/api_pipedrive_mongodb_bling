require('dotenv').config();
const mongoose = require('mongoose');
const { getWonDeals } = require('./src/services/pipedriveService');
const Opportunity = require('./src/models/opportunity');
const { sendToBling } = require('./src/services/blingService');
const connectToMongo = require('./src/config/db'); // aqui importa a função

async function runPipeline() {
  try {
    // Conecta ao MongoDB antes de tudo
    await connectToMongo();

    console.log('🚀 Buscando negócios ganhos do Pipedrive...');
    const deals = await getWonDeals();

    for (const deal of deals) {
      const existing = await Opportunity.findOne({ dealId: deal.id });
      if (existing) {
        console.log(`🟡 Negócio ${deal.id} já existe no MongoDB. Pulando...`);
        continue;
      }

      const opportunity = new Opportunity({
        dealId: deal.id,
        title: deal.title,
        value: deal.value,
        won_time: deal.won_time,
        date: new Date(), // << adiciona a data atual
        client: {
          name: deal.person_name,
          email: deal.email,
          phone: deal.phone
        }
      });

      await opportunity.save();
      console.log(`✅ Oportunidade ${deal.id} salva no MongoDB`);

      await sendToBling({
        id: deal.id,
        title: deal.title,
        value: deal.value,
        person_name: deal.person_name,
        email: deal.email,
        phone: deal.phone
      });
    }

    console.log('\n🎉 Processo finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro no pipeline:', error);
  } finally {
    mongoose.connection.close(); // Fecha conexão com o banco mesmo com erro
  }
}

runPipeline();
