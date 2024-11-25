const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const env = require('../../cypress.env.json');

let envName = 'maybank';
let telegramToken = env.env[envName].telegramToken;
let chatId = env.env[envName].chatId;

console.log('Initializing express app');
const app = express();
app.use(express.json());

const bot = new TelegramBot(telegramToken);

const webhookUrl = 'https://webhook.site/3de78299-51d3-43b0-8b81-2d41a6767a93';

bot.setWebHook(webhookUrl)
  .then(() => {
    console.log('Webhook set successfully');
  })
  .catch((error) => {
    console.error('Error setting webhook:', error);
  });

// Fungsi untuk mengirim pesan teks ke chatId
function sendMessage(message) {
  bot.sendMessage(chatId, message)
    .then(() => {
      console.log('Message sent successfully.');
    })
    .catch((error) => {
      console.error('Failed to send message:', error);
    });
}

// Endpoint webhook untuk menerima pesan dari Telegram
app.post('/webhook', (req, res) => {
  console.log('Received message:', req.body);
  const msg = req.body;

  if (msg.message) {
    const userMessage = msg.message.text.toLowerCase();
    if (userMessage === 'ya') {
      console.log('User confirmed with "ya".');
      sendMessage("Thank you for confirming!");
    } else if (userMessage === 'bukan') {
      console.log('User rejected with "bukan".');
      sendMessage("Sorry to hear that!");
    } else {
      console.log('Received unknown message:', userMessage);
      sendMessage("I'm not sure how to respond to that.");
    }
  } else {
    console.log('Received non-message update:', msg);
  }

  res.sendStatus(200); // Kirim status 200 OK ke Telegram
});

// Fungsi untuk mengirim foto
function sendPhoto(caption, photoPath) {
  bot.sendPhoto(chatId, photoPath, { caption: caption })
    .then(() => {
      console.log('Screenshot sent successfully.');
    })
    .catch((error) => {
      console.error('Failed to send screenshot:', error);
    });
}

app.listen(3000, function(){
  console.log("Running in port 3000")
  console.log('Telegram Token:', telegramToken);
  console.log('Chat ID:', chatId);
})