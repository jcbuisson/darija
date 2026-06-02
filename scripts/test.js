import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs';
import { exec } from 'child_process';
import readline from 'readline';

const openai = new OpenAI();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const input = await new Promise((resolve) => rl.question('Sentence to speak: ', (answer) => { rl.close(); resolve(answer); }));

const translation = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: 'You are a translator. Translate the given French text into Moroccan Darija as spoken in Casablanca. Return only the translated text, nothing else.',
    },
    { role: 'user', content: input },
  ],
});
const darija = translation.choices[0].message.content;
console.log('Darija:', darija);

const instructions = "Speak in Moroccan Darija. Natural, authentic Casablanca pronunciation.";

const response = await openai.audio.speech.create({
  model: 'gpt-4o-mini-tts',
  voice: 'alloy',
  input: darija,
  instructions,
});

const buffer = Buffer.from(await response.arrayBuffer());
const tmpFile = '/tmp/speak-darija.mp3';
await fs.promises.writeFile(tmpFile, buffer);
await new Promise((resolve, reject) => {
  exec(`afplay ${tmpFile}`, (err) => err ? reject(err) : resolve());
});

