import { isValidHostname } from 'erxes-shared/utils';
import * as mongoose from 'mongoose';
import { lol } from '~/sda/lol';

console.log(isValidHostname('localhost'));
mongoose.connect('mongodb://localhost:27017/test').catch((err) => {
  console.log(err);
});
lol();
