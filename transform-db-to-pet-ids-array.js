const fs = require('fs');

function transformDbToPetIdsArray(dbPath) {
  const db = fs.readFileSync(dbPath).toString().split("\n");
  return db.slice(0, db.length - 1);
}

module.exports = transformDbToPetIdsArray;