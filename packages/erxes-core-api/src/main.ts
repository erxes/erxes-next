import express from 'express';

import { erxesApiUtils } from 'erxes-api-utils';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3300;


const app = express();

app.get('/', (req, res) => {
  console.log(erxesApiUtils())
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
