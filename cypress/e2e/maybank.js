const { sendPhoto } = require('../support/telegram-bot');
const env = require('../../cypress.env.json');
const path = require('path');

let envName = 'maybank';

function sendScreenshotToTelegram(caption, screenshotFileName) {
  const screenshotPath = path.join(__dirname, '../../screenshots', screenshotFileName);
  cy.readFile(screenshotPath).then(() => {
    sendPhoto(caption, screenshotPath);
  }).catch((err) => {
    console.error('Screenshot path does not exist:', screenshotPath, err);
  });
}

describe('Login to Maybank', () => {
  it('Login to Maybank', () => {
    const config = env.env[envName];
    if (!config) throw new Error('Environment configuration for Maybank is missing');

    const { telegramToken, chatId, username, password } = config;
    if (!telegramToken || !chatId || !username || !password) {
      throw new Error('Required environment variables are missing');
    }

    cy.visit('https://m2u.maybank.co.id/home/login');

    cy.get('#login-username').type(username);
    cy.get('.mb3 > .MuiButtonBase-root').click();

    cy.screenshot('maybank-photo-confirmation').then(() => {
      sendScreenshotToTelegram('Konfirmasi jika foto benar.', 'maybank-photo-confirmation.png');
    });

    cy.wait(10000);
    cy.get('#login-password').type(password);
    cy.contains('MASUK').click();

    cy.url().then((url) => {
      const resultCaption = url.includes('dashboard')
        ? 'Login Maybank Berhasil!'
        : 'Login Maybank Gagal!';

      const screenshotName = url.includes('dashboard')
        ? 'maybank-login-success.png'
        : 'maybank-login-failed.png';

      cy.screenshot(screenshotName).then(() => {
        sendScreenshotToTelegram(resultCaption, screenshotName);
      });
    });
  });
});
