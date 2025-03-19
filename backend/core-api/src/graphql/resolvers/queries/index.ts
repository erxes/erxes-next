import { customerQueries } from './customer';
import { appQueries } from './app';
import { brandQueries } from './brand';
// import {  } from './company';
import { configQueries } from './configs';
import { activityLogQueries } from './activityLogs';
import { emailDeliveryQueries } from './emailDeliveries';
import { emailTemplateQueries } from './emailTemplates';
import { exchangeRateQueries } from './exchangeRates';
export default {
  ...activityLogQueries,
  ...appQueries,
  ...brandQueries,
  ...configQueries,
  ...emailDeliveryQueries,
  ...emailTemplateQueries,
  ...customerQueries,
  ...exchangeRateQueries,
};
