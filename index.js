const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Kael Proxy está vivo. Envie POST para /kael com { "message": "..." }');
});

app.post('/kael', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = completion.data.choices[0].message.content;
    res.json({ kael: reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Erro ao processar resposta da IA.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kael Proxy rodando na porta ${PORT}`);
});
