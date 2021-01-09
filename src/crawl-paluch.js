const fetch = require('node-fetch');

const argv = require('./argv');
const extractNewPetIds = require('./extract-new-pet-ids');
const notifyAboutPets = require('./notifications/notify-about-pets');

const { verbose } = argv;

const petToPetBreedQueryParamMap = {
  dog: '1',
  cat: '2',
};

const { queryAllPetIds, insertNewPetIds, disconnect } = require('./db');

function getDataUrl() {
  const baseUrl = 'https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/';
  return baseUrl + `?pet_species=${petToPetBreedQueryParamMap[argv.pet]}`;
}

async function fetchHtml(url) {
  const response = await fetch(url);
  return response.text();
}

function extractPetIds(html) {
  return Array.from(html.matchAll(/<a href="\/pet\/(\d+)\/">dowiedz/g))
    .map(rawIdMatch => rawIdMatch[0])
    .map(rawId => rawId.match(/\d+/))
    .map(idMatch => idMatch[0]);
}

async function fetchPetIds() {
  const url = getDataUrl();
  const allPetIds = [];
  for (let pageIndex = 1; pageIndex <= argv.pagesCount; pageIndex++) {
    const html = await fetchHtml(`${url}&pet_page=${pageIndex}`);
    const petIds = extractPetIds(html);
    allPetIds.push(...petIds);
  }
  verbose && console.log('partial new pet ids', allPetIds);
  return allPetIds;
}

async function crawl() {
  const [petIds, previousPetIds] = await Promise.all([fetchPetIds(), queryAllPetIds()]);
  console.log('previousPetIds', previousPetIds);
  const newPetIds = extractNewPetIds(petIds, previousPetIds);
  verbose && console.log('all new pet ids', newPetIds);
  await insertNewPetIds(newPetIds);
  const successfulNotificationsPetIds = await notifyAboutPets(newPetIds);
  // TODO update db to preserve failed notifications data
  disconnect();
}

crawl();
