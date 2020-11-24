const petIdsJsonPath = "./pet-ids.json";

async function getPetIds(): Promise<Array<string>> {
  try {
    const petIdsJson = await Deno.readTextFile(petIdsJsonPath)
    return JSON.parse(petIdsJson).ids || [];
  } catch (error) {
    console.log(error);
    return Promise.resolve([]);
  }
}

async function savePetIds(ids: Array<string>): Promise<void> {
  return Deno.writeTextFile(petIdsJsonPath, JSON.stringify({ids}))
}

async function getNewPetIdsFromArgs(): Promise<Array<string>> {
  const currentPetIds = await getPetIds();
  const newPetIds: Array<string> = [];
  Deno.args.forEach((petId: string) => {
    if (!currentPetIds.includes(petId)) {
      newPetIds.push(petId);
    }
  })
  return newPetIds;
}

function notifyAboutPets(petIds: Array<string>): void {
  // TODO
}

async function appendNewPetsToDbAndNotify(): Promise<void> {
  const currentPetIds = await getPetIds();
  const newPetIds = await getNewPetIdsFromArgs();
  notifyAboutPets(newPetIds);
  savePetIds([...currentPetIds, ...newPetIds])
}

appendNewPetsToDbAndNotify();
