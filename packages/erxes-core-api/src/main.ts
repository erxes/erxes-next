import express from 'express';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const corsOptions = {
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send({ message: 'Hello Cosadsresadsd API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
