const axios = require('axios');

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const BASE_URL = 'https://api.pipedrive.com/v1';

async function getWonDeals() {
  try {
    const response = await axios.get(`${BASE_URL}/deals`, {
      params: {
        status: 'won',
        api_token: PIPEDRIVE_API_TOKEN
      }
    });

    const deals = response.data.data;

    if (!Array.isArray(deals)) {
      throw new Error('Resposta inválida de getWonDeals.');
    }

    const opportunities = [];

    for (const deal of deals) {
      const { id, title, value, won_time, person_id, user_id } = deal;

      // ---------- Busca dados da pessoa ----------
      let person_name = 'Sem nome';
      let person_phone = 'Sem telefone';
      let person_email = 'Sem email';

      if (person_id && person_id.value) {
        const personRes = await axios.get(`${BASE_URL}/persons/${person_id.value}`, {
          params: { api_token: PIPEDRIVE_API_TOKEN }
        });
        const person = personRes.data.data;
        if (person) {
          person_name = person.name || 'Sem nome';
          person_phone = person.phone?.[0]?.value || 'Sem telefone';
          person_email = person.email?.[0]?.value || 'Sem email';
        }
      }

      // ---------- Busca dados do proprietário ----------
      let owner_name = 'Sem proprietário';
      if (user_id && user_id.id) {
        const userRes = await axios.get(`${BASE_URL}/users/${user_id.id}`, {
          params: { api_token: PIPEDRIVE_API_TOKEN }
        });
        const user = userRes.data.data;
        if (user) {
          owner_name = user.name || 'Sem proprietário';
        }
      }

      // ---------- Monta a oportunidade com ID ----------
      opportunities.push({
        id, // <- adiciona o ID aqui
        title,
        value,
        won_time,
        person_name,
        phone: person_phone,
        email: person_email,
        owner_name
      });
    }

    return opportunities;
  } catch (error) {
    console.error('Erro ao buscar negócios ganhos:', error.message);
    return [];
  }
}

module.exports = { getWonDeals };
