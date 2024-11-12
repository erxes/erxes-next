import { prisma } from './db';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'node:crypto';

function comparePassword(password: string, userPassword: string) {
  const hashPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  console.log('password:', password);
  console.log('hashPassword:', hashPassword);
  console.log('userPassword:', userPassword);
  return bcrypt.compare(hashPassword, userPassword);
}

function getTokenFields(user: any) {
  return {
    _id: user._id,
    email: user.email,
    details: user.details,
    isOwner: user.isOwner,
    groupIds: user.groupIds,
    brandIds: user.brandIds,
    username: user.username,
    code: user.code,
    departmentIds: user.departmentIds,
  };
}

function createTokens(_user: any, secret: string) {
  const user = getTokenFields(_user);

  const createToken = jwt.sign({ user }, secret, { expiresIn: '1d' });

  const createRefreshToken = jwt.sign({ user }, secret, {
    expiresIn: '7d',
  });

  return [createToken, createRefreshToken];
}

export async function login({
  email,
  password,
  deviceToken,
}: {
  email: string;
  password: string;
  deviceToken?: string;
}) {
  email = (email || '').toLowerCase().trim();
  password = (password || '').trim();

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  console.log('user:', user);

  if (!user || !user.password) {
    // user with provided email not found
    throw new Error('Invalid login 1');
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    // bad password
    throw new Error('Invalid login 2');
  }

  // create tokens
  const [token, refreshToken] = createTokens(user, 'FOOBAR');

  // // storing tokens in user collection.
  // if (token) {
  //   await saveValidatedToken(token, user);
  // }

  // if (deviceToken) {
  //   const deviceTokens: string[] = user.deviceTokens || [];

  //   if (!deviceTokens.includes(deviceToken)) {
  //     deviceTokens.push(deviceToken);

  //     await user.updateOne({ $set: { deviceTokens } });
  //   }
  // }

  // generate user code
  // await this.generateUserCodeField();

  // put permission map in redis, so that other services can use it
  // const userPermissions = await models.Permissions.find({
  //   userId: user._id
  // });

  // const groupPermissions = await models.Permissions.find({
  //   groupId: { $in: user.groupIds }
  // });

  // const actionMap = await userActionsMap(
  //   userPermissions,
  //   groupPermissions,
  //   user
  // );

  // await redis.set(
  //   `user_permissions_${user._id}`,
  //   JSON.stringify(actionMap)
  // );

  return {
    token,
    refreshToken,
  };
}
