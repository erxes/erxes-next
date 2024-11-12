import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 4000;
const prisma = new PrismaClient();

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});

app.get('/', async (req, res) => {
  const c = await prisma.customers.findFirst();
  res.json(c);
});
