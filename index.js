const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Rota de verificação simples
app.get('/', (req, res) => {
  res.send('Kael Proxy está vivo. Envie POST para /kael com { "message": "..." }');
});

// Rota principal da IA
app.post('/kael', async (req, res) => {
  const userMessage = req.body?.message;

  // Validação básica do campo 'message'
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: "Campo 'message' ausente ou inválido no corpo da requisição." });
  }

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
    console.error('Erro completo:', err.response?.data || err.message);
    res.status(500).send('Erro interno desconhecido');
  }
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kael Proxy rodando na porta ${PORT}`);
});
