import 'dotenv/config'
import express from 'express';
import OpenAI from 'openai';


const app = express();
app.use(express.json());

const openai = new OpenAI();

app.post('/speak', async (req, res) => {
  const { text } = req.body;

  const translation = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a translator. Translate the given French text into Moroccan Darija as spoken in Casablanca. Return only the translated text, nothing else.',
      },
      { role: 'user', content: text },
    ],
  });
  const darija = translation.choices[0].message.content;

  const audio = await openai.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'alloy',
    input: darija,
    instructions: 'Speak in Moroccan Darija. Natural, authentic Casablanca pronunciation.',
  });

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('X-Darija-Text', encodeURIComponent(darija));
  res.send(Buffer.from(await audio.arrayBuffer()));
});

const PORT = process.env.PORT || 3000
app.httpServer.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
