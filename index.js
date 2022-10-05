const TelegramApi = require('node-telegram-bot-api');

const token = '5633802234:AAEzesjBnMhxgFcJutp76O74Kkkh3Y1ipeg';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const gameOptions = {
  reply_markup: JSON.stringify({
      inline_keyboard: [
          [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
          [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
          [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
          [{text: '0', callback_data: '0'}],
      ]
  })
};

const againOptions = {
  reply_markup: JSON.stringify({
      inline_keyboard: [
          [{text: 'Играть еще раз', callback_data: '/again'}],
      ]
  })
};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Загадал целое число от 0 до 9');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Давай сыграем в игру' },
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/256/6.webp');
      return bot.sendMessage(chatId,  'Добро пожаловать в чат с Богданом');
    }
  
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${ msg.from.first_name }`);
    }

    if (text === '/game') {
      startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю'); 
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data == chats[chatId]) {
      await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
    } else {
        await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
    }
  })
}

start();