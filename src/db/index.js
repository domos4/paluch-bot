const { Client } = require('pg');
const format = require('pg-format');

const argv = require('../argv');

const { verbose } = argv;

const client = new Client();
client.connect();

async function queryAllPetIds() {
  const query = await client.query('SELECT "pet_id" FROM pets;');
  return query.rows.map(row => row["pet_id"]);
}

async function insertNewPetIds(petIds) {
  if (petIds.length === 0) {
    verbose && console.log('no pet ids to insert. terminating.');
    return;
  }
  const sql = format('INSERT INTO pets ("pet_id") VALUES %L', petIds.map(petId => [petId]));
  verbose && console.log('inserting new pet ids sql:', sql);
  await client.query(sql);
}

function disconnect() {
  client
    .end()
    .then(() => verbose && console.log('psql client has disconnected'))
    .catch(err => console.error('error during psql client disconnection', err.stack));
}

module.exports = {
  queryAllPetIds,
  insertNewPetIds,
  disconnect,
};
