const fs = require('fs');
const { execSync } = require('child_process');
const updateMasterDb = require('./update-db');

const time = new Date().getTime();
const dataPath = `./data/${time}`;

try {
  execSync(`mkdir data`);
} catch (error) {
  //ignore
}
execSync(`mkdir ${dataPath}`);

function fetchData(url, id) {
  const numberOfPages = 10;
  for (let pageIndex = 1; pageIndex <= numberOfPages; pageIndex++) {
    const htmlFileName = `${dataPath}/index_${id}_${pageIndex}.html`;
    const dbFileName = `${dataPath}/db_${id}_${pageIndex}`;
    const fetchHtmlCmd = `wget -O "${htmlFileName}" ${url}&pet_page=${pageIndex}`;
    console.log(fetchHtmlCmd);
    execSync(fetchHtmlCmd);
    const saveIdsToDbCmd = `cat "${htmlFileName}" | grep -Eo '<a href="/pet/(\\d+)/">dowiedz' | grep -Eo '\\d+' | tee "${dbFileName}"`;
    console.log(saveIdsToDbCmd);
    execSync(saveIdsToDbCmd);
    const db = fs.readFileSync(dbFileName).toString().split("\n");
    updateMasterDb(db.slice(0, db.length - 1), `${dataPath}/new-pet-ids_${id}_${pageIndex}.json`);
  }
}

const url = 'https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/';

fetchData(url + '?pet_species=1&pet_weight=2&pet_age=1', '1');
fetchData(url + '?pet_species=1&pet_weight=2&pet_age=2', '2');
