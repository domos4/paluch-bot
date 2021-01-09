function extractNewPetIds(petIds, previousPetIds) {
  const newPetIds = [];
  petIds.forEach((petId) => {
    if (!previousPetIds.includes(petId)) {
      newPetIds.push(petId);
    }
  });
  return newPetIds;
}

module.exports = extractNewPetIds;
