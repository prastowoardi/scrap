const fs = require('fs');
const env = require('../../cypress.env.json');
let telegramToken, chatId;
let envName = 'facebook';

function sendToTelegram(caption, screenshotFileName) {
  cy.readFile(`cypress/screenshots/facebook.js/${screenshotFileName}`, 'binary').then((fileContent) => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/png');

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, screenshotFileName);
    formData.append('caption', caption);

    cy.request({
      method: 'POST',
      url: `https://api.telegram.org/bot${telegramToken}/sendPhoto`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData,
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Status code:', response.status);
      cy.log('Response body:', JSON.stringify(response.body));

      expect(response.status).to.eq(200);
    });
  });
}

describe('Login to Facebook', () => {
  it('Logs in to Facebook and handles success or failure', () => {
    telegramToken = env.env[envName].telegramToken;
    chatId = env.env[envName].chatId;

    const username = env.env[envName].username;
    const password = env.env[envName].password;

    cy.visit('https://www.facebook.com/?locale=id_ID');

    cy.get('[data-testid="royal_email"]').type(username);
    cy.get('[data-testid="royal_pass"]').type(password);
    cy.get('[data-testid="royal_login_button"]').click();

    cy.url().then((url) => {
      if (url.includes('home')) {
        cy.get('[aria-label="Beranda"]').should('be.visible').then(() => {
          cy.screenshot('facebook-login-success');
          sendToTelegram('Login Facebook Berhasil!', 'facebook-login-success.png');
        });
      } else {
        cy.get('.UIFullPage_Container > .mvl').should('be.visible').then(() => {
          cy.screenshot('facebook-login-failed');
          sendToTelegram('Login Facebook Gagal!', 'facebook-login-failed.png');
        });
      }
    });
  });
});
