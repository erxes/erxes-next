import { authCookieOptions, getEnv } from 'erxes-api-utils';
import { IContext } from '../../../../@types';

type LoginParams = {
  email: string;
  password: string;
  deviceToken?: string;
};

export const authMutations = {
  async login(
    _root,
    args: LoginParams,
    { res, requestInfo, models, subdomain }: IContext,
  ) {
    const response = await models.Users.login(args);

    const { token } = response;

    const sameSite = getEnv({ name: 'SAME_SITE' });
    const DOMAIN = getEnv({ name: 'DOMAIN', subdomain });

    const cookieOptions: any = { secure: requestInfo.secure };
    if (sameSite && sameSite === 'none' && res.req.headers.origin !== DOMAIN) {
      cookieOptions.sameSite = sameSite;
    }

    res.cookie('auth-token', token, authCookieOptions(cookieOptions));

    return 'loggedIn';
  },
};
