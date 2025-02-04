import express from 'express';
import cors from 'cors';
import * as cookieParser from 'cookie-parser';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const domain = process.env.DOMAIN ?? 'http://localhost:3000';

const corsOptions = {
  credentials: true,
  origin: [domain],
};

const app = express();

async function start() {
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.get('/health', async (req, res) => {
    res.sendStatus(200);
  });

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

start();
