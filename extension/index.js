const fs = require('fs');
const Discord = require('discord.js');
const OpusScript = require("opusscript");
const command = require('./commands');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
let botToken;
let prefix = '!nodecg ';
let connection;
let audio;

ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Discord.Client();
module.exports = function(nodecg) {
	prefix = nodecg.bundleConfig.prefix;
	client.once('ready', () => {
		nodecg.log.info('Bot is now online. Use ' + nodecg.bundleConfig.prefix + 'connect to connect to a voice channel!')

		command(client, 'connect', nodecg.bundleConfig.prefix, (message) => {
			record(message);
		})
		command(client, 'disconnect', nodecg.bundleConfig.prefix, (message) => {
			try { message.member.voice.channel.leave() } catch { message.reply(`I'm not in a voice channel!`) }
		});
	})
}
client.login('bot token here');

async function record(message) {
	connection = await message.member.voice.channel.join();
	const audio = await connection.receiver.createStream(message.member, {
		mode: "pcm",
		end: "manual"
	});
	convertPCM(audio, 'bundles/discord-audio-capture/graphics/test.mp3');
}
async function convertPCM(input, dest) {
	ffmpeg(input).inputOptions(["-f", "s16le", "-ar", "48k", "-ac", "2", "tcp://localhost:9090/test.mp3"]).save(dest);
}
