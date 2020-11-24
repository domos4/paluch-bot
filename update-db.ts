import * as nodemailer from './nodemailer.js';

const petIdsJsonPath = './pet-ids.json';

async function getPetIds(): Promise<Array<string>> {
  try {
    const petIdsJson = await Deno.readTextFile(petIdsJsonPath);
    return JSON.parse(petIdsJson).ids || [];
  } catch (error) {
    console.log(error);
    return Promise.resolve([]);
  }
}

async function savePetIds(ids: Array<string>): Promise<void> {
  return Deno.writeTextFile(petIdsJsonPath, JSON.stringify({ ids }));
}

async function getNewPetIdsFromArgs(): Promise<Array<string>> {
  const currentPetIds = await getPetIds();
  const newPetIds: Array<string> = [];
  Deno.args.forEach((petId: string) => {
    if (!currentPetIds.includes(petId)) {
      newPetIds.push(petId);
    }
  });
  return newPetIds;
}

async function notifyAboutPet(petId: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.elasticemail.com",
    port: 2525,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'd.chmielarz@gmail.com',
      pass: '093E5DB527FCC39B66003E5E5ADEB4A2A00A',
    },
  });

  const info = await transporter.sendMail({
    from: '"Schornisko Paluch" <d.chmielarz@gmail.com>',
    to: "d.chmielarz@gmail.com",
    subject: "Nowy piesek na rejonie! 🐶",
    text: "https://napaluchu.waw.pl/pet/011903263/",
    html: '<a href="https://napaluchu.waw.pl/pet/011903263/">Link do pieska</a>',
  });

  console.log(info);
}

async function notifyAboutPets(petIds: Array<string>): Promise<Array<void>> {
  return Promise.all(petIds.map((petId) => notifyAboutPet(petId)));
}

async function appendNewPetsToDbAndNotify(): Promise<void> {
  const currentPetIds = await getPetIds();
  const newPetIds = await getNewPetIdsFromArgs();
  notifyAboutPets(newPetIds);
  savePetIds([...currentPetIds, ...newPetIds]);
}

// appendNewPetsToDbAndNotify();

// notifyAboutPet('012003403')
console.log(nodemailer);