const fs = require('fs');

const argv = require('./argv');

const { verbose } = argv;


function parsePetIdsJson(jsonPath) {
  try {
    const petIdsJson = fs.readFileSync(jsonPath);
    const petIds = JSON.parse(petIdsJson).ids || [];
    verbose && console.log(`parsed pet ids for json path: "${jsonPath}"`, petIds);
    return petIds;
  } catch (error) {
    return [];
  }
}

module.exports = parsePetIdsJson;
