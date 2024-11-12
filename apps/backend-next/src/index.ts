import express from 'express';

import { login } from './login';
import { prisma } from './db';

const app = express();
const port = 4000;

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});

app.get('/', async (req, res) => {
  const c = await prisma.customers.findFirst();
  res.json(c);
});

app.use(express.urlencoded());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const { token, refreshToken } = await login({ email, password });
  console.log(token, refreshToken);
  res.cookie('auth-token', token, { httpOnly: true });
  res.send('OK');
});
