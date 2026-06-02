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
            content: 'You are a translator. Translate the given French text into Moroccan Darija as spoken in Casablanca. Return a JSON object with two fields: "french" (a phonetic French transliteration of the Darija, using French phonetic conventions so a French speaker can read it aloud) and "arabic" (the Darija written in Arabic script). Return only the JSON object, nothing else.',
         },
         {
            role: 'user',
            content: text
         },
      ],
      response_format: { type: 'json_object' },
   });
   const { french: darijaFrench, arabic: darijaArabic } = JSON.parse(translation.choices[0].message.content);

   const audio = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: 'alloy',
      input: darijaArabic,
      instructions: 'Speak in Moroccan Darija. Natural, authentic Casablanca pronunciation.',
   });

   res.setHeader('Content-Type', 'audio/mpeg');
   res.setHeader('X-Darija-French', encodeURIComponent(darijaFrench));
   res.setHeader('X-Darija-Arabic', encodeURIComponent(darijaArabic));
   res.send(Buffer.from(await audio.arrayBuffer()));
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
