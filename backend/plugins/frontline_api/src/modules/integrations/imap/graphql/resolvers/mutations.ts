import { IContext } from '~/connectionResolvers';

export const imapMutations = {
  /**
   * Send mail
   */
  async imapSendMail(_root, args: any, { subdomain, models, user }: IContext) {
  try {
    // Basic validation
    if (!args.to || !args.subject || !args.text) {
      throw new Error('Missing required fields: to, subject or text');
    }
    
    // Authorization check
    if (!user) {
      throw new Error('Unauthorized access');
    }
    
    return  await models.ImapMessages.createSendMail(
      args,
      subdomain,
      models,
    );
    
  } catch (error) {
    console.error('Error sending mail:', error);
    throw new Error(`Failed to send mail: ${error.message}`);
  }
  },
};
