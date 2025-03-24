import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

import { redis } from 'erxes-api-utils';
import { IUserDocument, USER_ROLES, userSchema } from 'erxes-api-modules';

import { saveValidatedToken } from '../../../../auth/utils';
import { IModels } from '../../../../../connectionResolvers';
import { IUser } from 'erxes-api-modules';

const SALT_WORK_FACTOR = 10;

export interface ILoginParams {
  email: string;
  password?: string;
  deviceToken?: string;
}

export interface IUserModel extends Model<IUserDocument> {
  checkDuplication(params: {
    email?: string;
    idsToExclude?: string | string[];
    emails?: string[];
    employeeId?: string;
    username?: string;
  }): Promise<void>;
  createUser(doc: IUser & { notUsePassword?: boolean }): Promise<IUserDocument>;
  login(params: ILoginParams): { token: string; refreshToken: string };
  logout(user: IUserDocument, currentToken: string): Promise<string>;
  getSecret(): string;
  comparePassword(password: string, userPassword: string): Promise<boolean>;
  createTokens(user: IUserDocument, secret: string): Promise<string[]>;
  generatePassword(password: string): Promise<string>;
  findUsers(query: any, options?: any): Promise<IUserDocument[]>;
}

export const loadUserClass = (models: IModels) => {
  class User {
    /**
     * Create new user
     */
    public static async createUser({
      username,
      email,
      password,
      details,
      links,
      groupIds,
      isActive,
      isOwner = false,
      notUsePassword = false,
    }: IUser & { notUsePassword?: boolean }) {
      // empty string password validation

      if (password === '' && !notUsePassword) {
        throw new Error('Password can not be empty');
      }

      // Checking duplicated email
      await this.checkDuplication({ email });

      if (!notUsePassword) {
        this.checkPassword(password);
      }

      return models.Users.create({
        isOwner,
        username,
        email,
        details,
        links,
        groupIds,
        isActive: isActive !== undefined ? isActive : true,
        // hash password
        password: notUsePassword ? '' : await this.generatePassword(password),
      });
    }

    /**
     * Checking if user has duplicated properties
     */
    public static async checkDuplication({
      email,
      employeeId,
      username,
      idsToExclude,
    }: {
      email?: string;
      employeeId?: string;
      username?: string;
      idsToExclude?: string;
    }) {
      const query: { [key: string]: any } = {};
      let previousEntry;

      // Adding exclude operator to the query
      if (idsToExclude) {
        query._id = { $ne: idsToExclude };
      }

      // Checking if user has email
      if (email) {
        previousEntry = await models.Users.findUsers({ ...query, email });

        // Checking if duplicated
        if (previousEntry.length > 0) {
          throw new Error('Duplicated email');
        }
      }

      // Checking employeeId
      if (employeeId) {
        previousEntry = await models.Users.findOne({ ...query, employeeId });

        // Checking if duplicated
        if (previousEntry) {
          throw new Error('Duplicated Employee Id');
        }
      }

      //Checking username
      if (username) {
        previousEntry = await models.Users.findOne({ ...query, username });

        // Checking if duplicated
        if (previousEntry) {
          throw new Error('Duplicated User Name Id');
        }
      }
    }

    public static generatePassword(password: string) {
      const hashPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      return bcrypt.hash(hashPassword, SALT_WORK_FACTOR);
    }

    public static findUsers(query: any, options?: any) {
      const filter = { ...query, role: { $ne: USER_ROLES.SYSTEM } };

      try {
        models.Users.find(filter, options).lean();
      } catch (e) {
        console.error(e);
      }

      return models.Users.find(filter, options).lean();
    }

    public static async getUser(_id: string) {
      const user = await models.Users.findOne({ _id });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    }

    public static checkPassword(password: string) {
      if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
        throw new Error(
          'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
        );
      }
    }

    /*
     * Validates user credentials and generates tokens
     */
    public static async login({
      email,
      password,
      deviceToken,
    }: {
      email: string;
      password: string;
      deviceToken?: string;
    }) {
      email = (email || '').toLowerCase().trim();

      const user = await models.Users.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${email}$`, 'i') } },
          { username: { $regex: new RegExp(`^${email}$`, 'i') } },
        ],
        isActive: true,
      });

      if (!user || !user.password) {
        // user with provided email not found
        throw new Error('Invalid login');
      }
      const valid = await this.comparePassword(password, user.password);

      if (!valid) {
        // bad password
        throw new Error('Invalid login');
      }
      // create tokens
      const [token, refreshToken] = await this.createTokens(
        user,
        this.getSecret(),
      );

      if (token) {
        await saveValidatedToken(token, user);
      }

      // storing tokens in user collection.
      if (deviceToken) {
        const deviceTokens: string[] = user.deviceTokens || [];

        if (!deviceTokens.includes(deviceToken)) {
          deviceTokens.push(deviceToken);

          await user.updateOne({ $set: { deviceTokens } });
        }
      }

      return {
        token,
        refreshToken,
      };
    }

    /**
     * Logging out user from database
     */
    public static async logout(user: IUserDocument, currentToken: string) {
      const validatedToken = await redis.get(
        `user_token_${user._id}_${currentToken}`,
      );

      if (validatedToken) {
        await redis.del(`user_token_${user._id}_${currentToken}`);

        return 'loggedout';
      }

      return 'token not found';
    }

    public static getSecret() {
      return process.env.JWT_TOKEN_SECRET || 'SECRET';
    }
    /*
     * Creates regular and refresh tokens using given user information
     */

    public static async createTokens(_user: IUserDocument, secret: string) {
      const user = {
        _id: _user._id,
        isOwner: _user.isOwner,
      };

      const createToken = await jwt.sign({ user }, secret, { expiresIn: '1d' });

      const createRefreshToken = await jwt.sign({ user }, secret, {
        expiresIn: '7d',
      });

      return [createToken, createRefreshToken];
    }

    /*
     * Compare password
     */

    public static async comparePassword(
      password: string,
      userPassword: string,
    ) {
      const hashPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      return bcrypt.compare(hashPassword, userPassword);
    }

    public static async checkLoginAuth({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) {
      const user = await models.Users.findOne({
        $or: [
          { email: { $regex: new RegExp(`^${email}$`, 'i') } },
          { username: { $regex: new RegExp(`^${email}$`, 'i') } },
        ],
        isActive: true,
      });

      if (!user || !user.password) {
        // user with provided email not found
        throw new Error('Invalid login');
      }

      const valid = await this.comparePassword(password, user.password);

      if (!valid) {
        // bad password
        throw new Error('Invalid login');
      }

      return user;
    }
  }

  userSchema.loadClass(User);

  return userSchema;
};
