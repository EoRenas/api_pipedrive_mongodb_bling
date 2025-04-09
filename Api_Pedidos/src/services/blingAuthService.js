// src/services/blingAuthService.js
const axios = require('axios');

let accessToken = process.env.BLING_ACCESS_TOKEN;

async function getAccessToken() {
  return accessToken;
}

module.exports = { getAccessToken };