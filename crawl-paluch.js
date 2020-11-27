const { execSync } = require('child_process');
const extractNewPetIds = require('./extract-new-pet-ids');
const transformDbToPetIdsArray = require('./transform-db-to-pet-ids-array');
const parsePetIdsJson = require('./parse-pet-ids-json');
const notifyAboutPets = require('./notify-about-pets');

const time = new Date().getTime();
const dataParentPath = `./data/${time}`;
const batchPetIdsJsonPath = `${dataParentPath}/pet-ids.json`;

async function fetchData(url, id) {
  const numberOfPages = 10;
  for (let pageIndex = 1; pageIndex <= numberOfPages; pageIndex++) {
    const pageDirName = `page${pageIndex}`;
    const dataPath = `${dataParentPath}/${id}/${pageDirName}`;
    execSync(`mkdir -p ${dataPath}`);
    const htmlFileName = `${dataPath}/index.html`;
    const dbFileName = `${dataPath}/db`;
    const fetchHtmlCmd = `wget -O "${htmlFileName}" "${url}&pet_page=${pageIndex}"`;
    console.log(fetchHtmlCmd);
    execSync(fetchHtmlCmd);
    const saveIdsToDbCmd = `cat "${htmlFileName}" | grep -Eo '<a href="/pet/(\\d+)/">dowiedz' | grep -Eo '\\d+' | tee "${dbFileName}"`;
    console.log(saveIdsToDbCmd);
    execSync(saveIdsToDbCmd);
    extractNewPetIds(transformDbToPetIdsArray(dbFileName), batchPetIdsJsonPath, `${dataPath}/new-pet-ids.json`);
  }
  const newPetIds = extractNewPetIds(parsePetIdsJson(batchPetIdsJsonPath), `./pet-ids.json`);
  // await notifyAboutPets(newPetIds);
}

async function crawl() {
  const url = 'https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/';
  await fetchData(url + '?pet_species=1&pet_weight=2&pet_age=1', 'query1');
  await fetchData(url + '?pet_species=1&pet_weight=2&pet_age=2', 'query2');
}


execSync(`mkdir -p ${dataParentPath}`);
crawl();
