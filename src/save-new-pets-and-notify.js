const fetch = require('node-fetch');

const argv = require('./argv');
const extractNewPetIds = require('./extract-new-pet-ids');
const notifyAboutPets = require('./notifications/notify-about-pets');

const { verbose, pet, pagesCount } = argv;

const petToPetBreedQueryParamMap = {
  dog: '1',
  cat: '2',
};

const {
  queryAllPetIds,
  queryUnnotifiedPetIds,
  insertNewPetIds,
  setNotifiedTrueForGivenPetIds,
  disconnect,
} = require('./db');

function getDataUrl() {
  const baseUrl = 'https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/';
  return baseUrl + `?pet_species=${petToPetBreedQueryParamMap[pet]}`;
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
  for (let pageIndex = 1; pageIndex <= pagesCount; pageIndex++) {
    const html = await fetchHtml(`${url}&pet_page=${pageIndex}`);
    const petIds = extractPetIds(html);
    allPetIds.push(...petIds);
    verbose && console.log(`new pet ids from page ${pageIndex}:`, allPetIds);
  }
  return allPetIds;
}

async function getNewPetIds() {
  const [petIds, previousPetIds] = await Promise.all([fetchPetIds(), queryAllPetIds()]);
  const newPetIds = extractNewPetIds(petIds, previousPetIds);
  verbose && console.log('fetched pet ids', petIds);
  verbose && console.log('previous pet ids', previousPetIds);
  verbose && console.log('calculated new pet ids', newPetIds);
  return newPetIds;
}

async function execute() {
  const newPetIds = await getNewPetIds();
  await insertNewPetIds(newPetIds);
  const unnotifiedPetIds = await queryUnnotifiedPetIds();
  const successfulNotificationsPetIds = await notifyAboutPets(unnotifiedPetIds);
  await setNotifiedTrueForGivenPetIds(successfulNotificationsPetIds);
  await disconnect();
}

async function executeWithLogging() {
  verbose && console.log(`starting execution for pet="${pet}", pagesCount=${pagesCount}`);
  const startTime = new Date().getTime();
  await execute();
  const endTime = new Date().getTime();
  const timeSpent = endTime - startTime;
  verbose && console.log(`execution ended.`);
  verbose && console.log(`took ${timeSpent / 1000} seconds to execute.`);
}

executeWithLogging();
