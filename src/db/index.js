const { Client } = require('pg');
const format = require('pg-format');

const client = new Client();
client.connect();

async function queryAllPetIds() {
  const query = await client.query('SELECT "pet_id" FROM pets;');
  return query.rows;
}

async function insertNewPetIds(petIds) {
  const sql = format('INSERT INTO pets ("pet_id") VALUES %L', petIds.map(petId => [petId]));
  console.log('sql', sql);
  await client.query(sql);
}

function disconnect() {
  client
    .end()
    .then(() => console.log('client has disconnected'))
    .catch(err => console.error('error during disconnection', err.stack));
}

module.exports = {
  queryAllPetIds,
  insertNewPetIds,
  disconnect,
};
