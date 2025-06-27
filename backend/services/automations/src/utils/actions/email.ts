export const handleEmail = async ({
  subdomain,
  target,
  execution,
  triggerType,
  config,
}) => {
  try {
    return {};
    //   const params = await generateDoc({
    //     subdomain,
    //     triggerType,
    //     target,
    //     config,
    //     execution,
    //   });

    //   if (!params) {
    //     return { error: "Something went wrong fetching data" };
    //   }

    //   const responses = await sendEmails({
    //     subdomain,
    //     params,
    //   });

    //   await setActivityLog({
    //     subdomain,
    //     triggerType,
    //     target,
    //     responses,
    //   });

    //   return { ...params, responses };
  } catch (err) {
    return { error: err.message };
  }
};
