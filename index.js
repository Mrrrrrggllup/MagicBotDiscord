const discord = require('discord.js');
const fetch = require("node-fetch");
const bot = new discord.Client();
const properties = require('./bot.json');
bot.login(properties.botInfo.token);
const botName = 'magicbot';
let actualAuthor = 0;
const url = "http://horoscope-api.herokuapp.com/horoscope/today/";
let somebodysaymagicbot = false;
const possibleAnswers = ['horoscope'];
let question= '';
const mp3Horoscope = './NounoursdenoelHoroscope.mp3';
let currentGuild = new Map();


bot.on('message', function (message) {

    currentAnswer(message.content.toLowerCase(), possibleAnswers);
    somebodysaymagicbot = message.content.toLowerCase().indexOf(botName) !== -1;
    if (somebodysaymagicbot) {
        switch (question) {
            case 'horoscope' :
                getHoroscope(actualAuthor, message);
                break;
        }
    }
});

function getHoroscope(actAuthor, message) {

    const author = message.author.id;
    message.reply('Bien sur ! Quel est votre signe astrologique ? (tapez !!{monSigneEnAnglais})');
    bot.on('message', function (rep) {

        if (rep.author.id === author && rep.content.includes('!!')) {
            const sign = rep.content.replace('!!', "");
            fetch(url + sign)
                .then(rep => rep.json())
                .then(json => {
                    let currentGuild = rep.channel.guild;
                    let chans;
                    let test = currentGuild.channels.cache.each(c => console.log(c.type)).filter(c => c.type === 'voice');
                    let vocalChan = test.last();
                    playAudioMessage(vocalChan);
                    rep.reply('Voila ton horoscope du jour : ' + json.horoscope);
                });
        }
        actualAuthor = 0;
    })
}

function currentAnswer (mess , possibleAns) {
    possibleAns.forEach(answer => {
        if (mess.indexOf(answer) !== -1) {
            question = answer;
        }
    });
}

async function playAudioMessage(channel) {
    //TODO : refaire cette fonction
    await channel.join().then(async (connection) => {
        let dispatcher = await connection.playFile(mp3Horoscope);
        await dispatcher.on('end', function () {
            channel.leave()
        })
    })
}

