const fs = require('fs');

function parsePetIdsJson(jsonPath) {
  try {
    const petIdsJson = fs.readFileSync(jsonPath);
    return JSON.parse(petIdsJson).ids || [];
  } catch (error) {
    return [];
  }
}

module.exports = parsePetIdsJson;
