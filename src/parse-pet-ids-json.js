const fs = require('fs');

function parsePetIdsJson(jsonPath) {
  try {
    const petIdsJson = fs.readFileSync(jsonPath);
    const petIds = JSON.parse(petIdsJson).ids || [];
    console.log(`parsed pet ids for json path: "${jsonPath}"`, petIds);
    return petIds;
  } catch (error) {
    return [];
  }
}

module.exports = parsePetIdsJson;
