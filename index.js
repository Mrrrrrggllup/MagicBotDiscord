const discord = require('discord.js');
const fetch = require("node-fetch");
const prismmedia = require('prism-media');
const opusscript = require('opusscript');
const ffmpeg_static = require('ffmpeg-static');
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
let isBusy = false;


bot.on('message', function (message) {

    currentAnswer(message.content.toLowerCase(), possibleAnswers);
    somebodysaymagicbot = message.content.toLowerCase().indexOf(botName) !== -1;

    if (somebodysaymagicbot && !isBusy) {
        isBusy = true;
        switch (question) {
            case 'horoscope' :
                getHoroscope(message);
                break;
            default : isBusy = false;
        }
    }
});

function getHoroscope(message) {

    const author = message.author.id;
    message.reply('Bien sur ! Quel est votre signe astrologique ? (tapez !!{monSigneEnAnglais})');
    bot.on('message', function (rep) {

        if (rep.author.id === author && rep.content.includes('!!')) {
            const sign = rep.content.replace('!!', "");
            fetch(url + sign)
                .then(rep => rep.json())
                .then(json => {
                    let vocalChan = rep.member.voice.channel;
                    if (vocalChan) {
                        playAudioMessage(vocalChan);
                    }
                    rep.reply('Voila ton horoscope du jour : ' + json.horoscope);
                });
        }
        isBusy = false;
        return null;
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
    channel.join()
        .then(connection => {
            console.log('i am connected on vocal')
            const dispatcher = connection.play(mp3Horoscope)
            dispatcher.on('end', () => {
                channel.leave();
                console.log('I am leaving right now');
            })
                .on('error', () => {
                    console.error(error)
                })
            })
        .catch(console.error);
}

