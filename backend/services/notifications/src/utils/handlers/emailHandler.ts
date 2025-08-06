import { Job } from 'bullmq';
import { createTransporter, generateFromEmail } from '@/utils/email/emailUtils';
import { debugError, debugInfo } from '@/utils/debugger';
import { INotificationJobData } from '@/types';
import { EMAIL_SERVICES } from '@/constants';

// export const handleEmail = async (job: Job<INotificationJobData>) => {
//   const { subdomain, config } = job.data;
//   const { toEmails, fromUserId, subject, content, attachments } = config;

//   if (!toEmails?.length) {
//     debugError('No recipient emails found');
//     return { error: 'No recipient emails found' };
//   }

//   try {
//     const emailService = EMAIL_SERVICES.SES; // or any other service

//     const transporter = await createTransporter({
//       ses: {
//         accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
//         region: process.env.AWS_REGION!,
//       },
//     });

//     for (const toEmail of toEmails) {
//       const mailOptions = {
//         from: generateFromEmail('Your Service', 'no-reply@yourdomain.com'),
//         to: toEmail,
//         subject,
//         text: content,
//         attachments,
//       };

//       try {
//         const info = await transporter.sendMail(mailOptions);
//         debugInfo(`Email sent: ${info.messageId}`, { toEmail });
//       } catch (error) {
//         debugError('Error sending email', { error, toEmail });
//       }
//     }

//     return { success: true };
//   } catch (error) {
//     debugError('Error initializing email transport', error);
//     return { error: 'Error initializing email transport' };
//   }
// };
