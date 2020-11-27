const fs = require('fs');

function getPetIds(petIdsPath) {
  try {
    const petIdsJson = fs.readFileSync(petIdsPath);
    return JSON.parse(petIdsJson).ids || [];
  } catch (error) {
    return [];
  }
}

function savePetIds(ids, petIdsPath) {
  fs.writeFileSync(petIdsPath, JSON.stringify({ ids }));
}

function saveCache(ids, path) {
  if (path) {
    fs.writeFileSync(path, JSON.stringify({ ids }));
  }
}

function getNewPetIds(petIds, petIdsPath) {
  const currentPetIds = getPetIds(petIdsPath);
  const newPetIds = [];
  petIds
    .map((petId) => petId.toString())
    .forEach((petId) => {
      if (!currentPetIds.includes(petId)) {
        newPetIds.push(petId);
      }
    });
  return newPetIds;
}

function appendNewPetsToDb(petIds, petIdsPath, newPetIdsCachePath) {
  const currentPetIds = getPetIds(petIdsPath);
  const newPetIds = getNewPetIds(petIds, petIdsPath);
  saveCache(newPetIds, newPetIdsCachePath);
  savePetIds([...currentPetIds, ...newPetIds], petIdsPath);
}

module.exports = appendNewPetsToDb;
