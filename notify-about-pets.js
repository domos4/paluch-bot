const nodemailer = require('nodemailer');

const recipients = [
  'd.chmielarz@gmail.com',
  // 'stachmielarz@gmail.com',
];

async function getMockTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
}

function getProductionTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false,
    auth: {
      user: 'd.chmielarz@gmail.com',
      pass: '093E5DB527FCC39B66003E5E5ADEB4A2A00A',
    },
  });
}

async function getTransporter() {
  if (process.env.NODE_ENV === 'production') {
    return getProductionTransporter();
  }
  return getMockTransporter();
}

function getLinkToPet(petId) {
  return `<a href="https://napaluchu.waw.pl/pet/${petId}/">Link do pieska nr ${petId}</a>`;
}

function getNotificationHtml(petIds) {
  return `
    <div>
        ${petIds.map((petId) => getLinkToPet(petId)).join('<br/>\n')}
    </div>
  `;
}

async function notifyAboutPets(petIds) {
  if (petIds.length === 0) {
    return;
  }
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: '"Schornisko Paluch" <d.chmielarz@gmail.com>',
      to: recipients.join(', '),
      subject: 'Nowy piesek na rejonie! 🐶',
      html: getNotificationHtml(petIds),
    });
    console.log(getNotificationHtml(petIds));
    console.log(info);
  } catch (error) {
    console.error(error);
  }
}


module.exports = notifyAboutPets;
