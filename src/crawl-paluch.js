const { execSync } = require('child_process');

const argv = require('./argv');
const extractNewPetIds = require('./extract-new-pet-ids');
const transformDbToPetIdsArray = require('./transform-db-to-pet-ids-array');
const parsePetIdsJson = require('./parse-pet-ids-json');
const notifyAboutPets = require('./notifications/notify-about-pets');

const time = new Date().getTime();
const dataParentPath = `./data/${time}`;
const batchPetIdsJsonPath = `${dataParentPath}/pet-ids.json`;
const { verbose } = argv;

const petToPetBreedQueryParamMap = {
  dog: '-1',
  cat: '-2',
};

function getDataUrl() {
  const baseUrl = 'https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/';
  return baseUrl + `?pet_breed=${petToPetBreedQueryParamMap[argv.pet]}`;
}

function fetchDataAndWriteToBatchPetIdsJson() {
  const url = getDataUrl();
  for (let pageIndex = 1; pageIndex <= argv.pagesCount; pageIndex++) {
    const pageDirName = `page${pageIndex}`;
    const dataPath = `${dataParentPath}/${pageDirName}`;
    execSync(`mkdir -p ${dataPath}`);
    const htmlFileName = `${dataPath}/index.html`;
    const dbFileName = `${dataPath}/db`;
    const fetchHtmlCmd = `wget -O "${htmlFileName}" "${url}&pet_page=${pageIndex}"`;
    verbose && console.log(fetchHtmlCmd);
    execSync(fetchHtmlCmd);
    const saveIdsToDbCmd = `cat "${htmlFileName}" | grep -Eo '<a href="/pet/(\\d+)/">dowiedz' | grep -Eo '\\d+' | tee "${dbFileName}"`;
    verbose && console.log(saveIdsToDbCmd);
    execSync(saveIdsToDbCmd);
    const newPetIds = extractNewPetIds(transformDbToPetIdsArray(dbFileName), batchPetIdsJsonPath, `${dataPath}/new-pet-ids.json`);
    verbose && console.log('partial new pet ids', newPetIds);
  }
}

function maybeRemoveTemporaryData() {
  if (!argv.preserveData) {
    execSync('rm -rf data');
  }
}

async function crawl() {
  fetchDataAndWriteToBatchPetIdsJson();
  const newPetIds = extractNewPetIds(parsePetIdsJson(batchPetIdsJsonPath), `./pet-ids.json`);
  verbose && console.log('all new pet ids', newPetIds);
  await notifyAboutPets(newPetIds);
  maybeRemoveTemporaryData();
}

execSync(`mkdir -p ${dataParentPath}`);
crawl();
