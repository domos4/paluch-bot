const { execSync } = require('child_process');
const notificationCopyDog = require('./notification-copy-dog');
const notificationCopyCat = require('./notification-copy-cat');
const argv = require('./argv');

function maybeTweet(notification) {
  if (process.env.NODE_ENV === 'production') {
    return execSync(`twurl -d 'status=${notification}' /1.1/statuses/update.json`);
  }
}

function getLinkToPet(petId) {
  return `https://napaluchu.waw.pl/pet/${petId}/`;
}

function getNotificationContent(petIds) {
  const copy = argv.pet === 'cat' ? notificationCopyCat : notificationCopyDog;
  return `
    ${copy} ${petIds.map((petId) => getLinkToPet(petId)).join(' ')}
  `;
}

async function notifyAboutPets(petIds) {
  if (petIds.length === 0) {
    return;
  }
  const notification = getNotificationContent(petIds);
  console.log('notifying with the following content:');
  console.log(notification);
  try {
    maybeTweet(notification);
  } catch (error) {
    console.error(error);
  }
}


module.exports = notifyAboutPets;
