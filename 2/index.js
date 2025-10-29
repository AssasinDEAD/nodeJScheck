// http.js — делает GET-запрос к публичному API и логирует ответ
const axios = require('axios');

async function fetchJson(url = 'https://jsonplaceholder.typicode.com/todos/1') {
  try {
    const res = await axios.get(url, { timeout: 5000 });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
    return res.data;
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  const url = process.argv[2];
  fetchJson(url);
}

module.exports = fetchJson;
