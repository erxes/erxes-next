import { authCookieOptions, getEnv, logHandler } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

type LoginParams = {
  email: string;
  password: string;
  deviceToken?: string;
};

export const authMutations = {
  /*
   * Login
   */
  async login(
    _parent: undefined,
    args: LoginParams,
    { req, res, requestInfo, models, subdomain }: IContext,
  ) {
    return await logHandler(
      async () => {
        const response = await models.Users.login(args);

        const { token } = response;

        const sameSite = getEnv({ name: 'SAME_SITE' });
        const DOMAIN = getEnv({ name: 'DOMAIN', subdomain });

        const cookieOptions: any = { secure: requestInfo.secure };
        if (
          sameSite &&
          sameSite === 'none' &&
          res.req.headers.origin !== DOMAIN
        ) {
          cookieOptions.sameSite = sameSite;
        }

        res.cookie('auth-token', token, authCookieOptions(cookieOptions));

        return 'loggedIn';
      },
      {
        subdomain,
        source: 'auth',
        action: 'login',
        userId: (await models.Users.findOne({ email: args.email }).lean())?._id,
        payload: {
          headers: req.headers,
          email: args?.email,
          method: 'email/password',
        },
      },
      null,
      null,
      true,
    );
  },
  /*
   * logout
   */
  async logout(
    _parent: undefined,
    _args: undefined,
    { req, res, user, requestInfo, models, subdomain }: IContext,
  ) {
    await logHandler(
      async () => {
        const logout = await models.Users.logout(
          user,
          requestInfo.cookies['auth-token'],
        );
        res.clearCookie('auth-token');
        return logout;
      },
      {
        subdomain,
        source: 'auth',
        action: 'logout',
        userId: user._id,
        payload: { headers: req.headers, email: user?.email },
      },
    );
  },

  /*
   * Send forgot password email
   */
  async forgotPassword(
    _parent: undefined,
    { email }: { email: string },
    { subdomain, models }: IContext,
  ) {
    const token = await models.Users.forgotPassword(email);

    // send email ==============
    const DOMAIN = getEnv({ name: 'DOMAIN', subdomain });

    const link = `${DOMAIN}/reset-password?token=${token}`;

    console.log(subdomain, models, DOMAIN, link);

    // await utils.sendEmail(
    //   subdomain,
    //   {
    //     toEmails: [email],
    //     title: 'Reset password',
    //     template: {
    //       name: 'resetPassword',
    //       data: {
    //         content: link,
    //       },
    //     },
    //   },
    //   models
    // );

    return 'sent';
  },

  /*
   * Reset password
   */
  async resetPassword(
    _parent: undefined,
    args: { token: string; newPassword: string },
    { models }: IContext,
  ) {
    return models.Users.resetPassword(args);
  },

  async loginWithGoogle(
    _root: undefined,
    _params: undefined,
    { models, subdomain }: IContext,
  ) {
    try {
      console.log(models, subdomain);
      return null;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async loginWithMagicLink(
    _parent: undefined,
    { email }: { email: string },
    { models, subdomain }: IContext,
  ) {
    try {
      console.log(models, subdomain, email);
      return 'Invalid login';
    } catch (e) {
      throw new Error(e.message);
    }
  },
};
