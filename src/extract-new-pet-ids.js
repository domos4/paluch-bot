const fs = require('fs');
const parsePetIdsJson = require('./parse-pet-ids-json');

function writePetIdsToJson(ids, path) {
  fs.writeFileSync(path, JSON.stringify({ ids }));
}

function getNewPetIds(inputPetIds, currentPetIds) {
  const newPetIds = [];
  inputPetIds.forEach((petId) => {
    if (!currentPetIds.includes(petId)) {
      newPetIds.push(petId);
    }
  });
  return newPetIds;
}

function extractNewPetIds(inputPetIds, masterPetIdsJsonPath) {
  const currentPetIds = parsePetIdsJson(masterPetIdsJsonPath);
  const newPetIds = getNewPetIds(inputPetIds, currentPetIds);
  writePetIdsToJson([...currentPetIds, ...newPetIds], masterPetIdsJsonPath);
  return newPetIds;
}

module.exports = extractNewPetIds;
