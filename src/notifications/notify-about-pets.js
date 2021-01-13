const { execSync } = require('child_process');

const argv = require('../argv');
const notificationCopyDog = require('./notification-copy-dog');
const notificationCopyCat = require('./notification-copy-cat');

const { verbose } = argv;

function getLinkToPet(petId) {
  return `https://napaluchu.waw.pl/pet/${petId}/`;
}

function getNotificationContent(petId) {
  const copy = argv.pet === 'cat' ? notificationCopyCat : notificationCopyDog;
  return `
    ${copy} ${getLinkToPet(petId)}
  `;
}

function maybeTweet(petId) {
  const notification = getNotificationContent(petId);
  verbose && console.log('notifying with the following content:');
  verbose && console.log(notification);
  if (process.env.NODE_ENV === 'production') {
    verbose && console.log('trying to tweet...');
    const twitterResponse = execSync(`twurl -d 'status=${notification}' /1.1/statuses/update.json`).toString();
    const parsedTwitterResponse = JSON.parse(twitterResponse);
    const errors = parsedTwitterResponse.errors;
    if (!errors) {
      verbose && console.log('tweet successful');
      return true;
    }
    if (errors.length === 1 && errors[0].code === 186) { // too long tweet
      console.error('tweet failed due to being too long');
    } else {
      console.error('tweet failed with unhandled errors');
      console.error(errors);
    }
  }
  return false;
}

async function notifyAboutPets(petIds) {
  if (petIds.length === 0) {
    verbose && console.log('no pets to notify about. terminating.');
    return;
  }
  const successfulNotifications = [];
  petIds.forEach((petId) => {
    const notifiedSuccessfully = maybeTweet(petId);
    if (notifiedSuccessfully) {
      successfulNotifications.push(petId);
    }
  });
  return successfulNotifications;
}

module.exports = notifyAboutPets;
