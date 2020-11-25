const fs = require('fs');
const { argv } = require('yargs');
const nodemailer = require('nodemailer');

const petIdsJsonPath = `./pet-ids.json`;

function getPetIds() {
  try {
    const petIdsJson = fs.readFileSync(petIdsJsonPath);
    return JSON.parse(petIdsJson).ids || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function savePetIds(ids) {
  fs.writeFileSync(petIdsJsonPath, JSON.stringify({ ids }));
}

function saveCache(ids) {
  fs.writeFileSync(`${argv.dataPath}new-pet-ids.json`, JSON.stringify({ ids }));
}

function getNewPetIdsFromArgs() {
  const currentPetIds = getPetIds();
  const newPetIds = [];
  argv._
    .map((petId) => petId.toString())
    .forEach((petId) => {
      if (!currentPetIds.includes(petId)) {
        newPetIds.push(petId);
      }
    });
  return newPetIds;
}

function getLinkToPet(petId) {
  return `<a href="https://napaluchu.waw.pl/pet/${petId}/">Link do pieska nr ${petId}</a>`;
}

function getNotificationHtml(petIds) {
  return `
    <div>
        ${petIds.map((petId) => `${getLinkToPet(petId)}<br/>`)}
    </div>
  `;
}

async function notifyAboutPets(petIds) {
  if (petIds.length === 0) {
    return;
  }

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.elasticemail.com',
  //   port: 2525,
  //   secure: false,
  //   auth: {
  //     user: 'd.chmielarz@gmail.com',
  //     pass: '093E5DB527FCC39B66003E5E5ADEB4A2A00A',
  //   },
  // });

  try {
    const info = await transporter.sendMail({
      from: '"Schornisko Paluch" <d.chmielarz@gmail.com>',
      to: 'd.chmielarz@gmail.com',
      subject: 'Nowy piesek na rejonie! 🐶',
      text: 'https://napaluchu.waw.pl/pet/011903263/',
      html: getNotificationHtml(petIds),
    });
    console.log(getNotificationHtml(petIds))
    console.log(info);
  } catch (error) {
    console.error(error);
  }
}

async function appendNewPetsToDbAndNotify() {
  const currentPetIds = getPetIds();
  const newPetIds = getNewPetIdsFromArgs();
  saveCache(newPetIds);
  try {
    await notifyAboutPets(newPetIds);
    savePetIds([...currentPetIds, ...newPetIds]);
  } catch (error) {
    console.error(error);
  }
}

// appendNewPetsToDbAndNotify();
