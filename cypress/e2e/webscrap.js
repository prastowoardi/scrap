const env = require('../../cypress.env.json');
let telegramToken, chatId;
let envName = 'webscraperToken';

describe('webscraper.io', () => {
  it('Fetches product', () => {
    telegramToken = env.env[envName].telegramToken
    chatId = env.env[envName].chatId
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendPhoto`;

    cy.visit('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');

    // Ambil item tertentu dari halaman
    cy.get('.col-lg-9 > .row > :nth-child(12)').then((items) => {
      const products = [...items].map(item => {
        const title = item.querySelector('.title').innerText;
        const price = item.querySelector('.price').innerText;
        const description = item.querySelector('.description').innerText;
        const imageUrl = item.querySelector('img').src;

        return { title, price, description, imageUrl };
      });

      const additionalText = '<b>webscraper.io</b>\n\n';

      products.forEach(product => {
        const message =  additionalText + `<b>Title:</b> ${product.title}\n<b>Price:</b> ${product.price}\n<b>Description:</b> ${product.description}`;

        cy.request({
          method: 'POST',
          url: telegramUrl,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            chat_id: chatId,
            photo: product.imageUrl,  
            caption: message,        
            parse_mode: 'HTML'
          },
          failOnStatusCode: false
        }).then((response) => {
          cy.log('Status code:', response.status);
          cy.log('Response body:', JSON.stringify(response.body));

          expect(response.status).to.eq(200);
        });
      });
    });
  });
});
