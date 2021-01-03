const { execSync } = require('child_process');

const argv = require('../argv');
const notificationCopyDog = require('./notification-copy-dog');
const notificationCopyCat = require('./notification-copy-cat');

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
  console.log('notifying with the following content:');
  console.log(notification);
  if (process.env.NODE_ENV === 'production') {
    console.log('trying to tweet...');
    const twitterResponse = execSync(`twurl -d 'status=${notification}' /1.1/statuses/update.json`).toString();
    const parsedTwitterResponse = JSON.parse(twitterResponse);
    const errors = parsedTwitterResponse.errors;
    if (!errors) {
      return console.log('tweet successful');
    }
    if (errors.length === 1 && errors[0].code === 186) { // too long tweet
      console.log('tweet failed due to being too long');
    } else {
      console.log('tweet failed with unhandled errors');
      console.log(errors);
    }
  }
}

async function notifyAboutPets(petIds) {
  if (petIds.length === 0) {
    console.log('no pets to notify about. aborting.');
    return;
  }
  petIds.forEach(maybeTweet);
}


module.exports = notifyAboutPets;
