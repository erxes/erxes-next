import { STATUSES } from "erxes-api-utils";

export const COMPANY_SELECT_OPTIONS = {
    BUSINESS_TYPES: [
      { label: "Competitor", value: "Competitor" },
      { label: "Customer", value: "Customer" },
      { label: "Investor", value: "Investor" },
      { label: "Partner", value: "Partner" },
      { label: "Press", value: "Press" },
      { label: "Prospect", value: "Prospect" },
      { label: "Reseller", value: "Reseller" },
      { label: "Other", value: "Other" },
      { label: "Unknown", value: "" }
    ],
    STATUSES,
    DO_NOT_DISTURB: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Unknown", value: "" }
    ]
  };