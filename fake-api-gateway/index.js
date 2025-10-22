const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// Endpoint para simular a criação de um número de telefone
app.post('/phone-numbers', (req, res) => {
  console.log('Fake API received request to create phone number:', req.body);

  const { areaCode, subscriptionPlanId } = req.body;

  if (!areaCode || !subscriptionPlanId) {
    return res.status(400).json({ message: 'Missing areaCode or subscriptionPlanId' });
  }

  // Lógica de simulação: Gera um número de 11 dígitos (XX9XXXXXXXX)
const fakePhoneNumber = `+55${areaCode}9${Math.floor(10000000 + Math.random() * 90000000)}`;

  console.log('Responding with fake phone number:', fakePhoneNumber);

  res.status(201).json({
    phoneNumber: fakePhoneNumber,
    success: true,
  });
});

app.listen(port, () => {
  console.log(`Fake API gateway listening at http://localhost:${port}`);
});
