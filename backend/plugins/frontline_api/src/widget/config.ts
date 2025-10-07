// src/config.ts
declare global {
  interface Window {
    WIDGET_CONFIG?: {
      API_URL: string;
    };
    erxesSettings?: {
      messenger?: {
        brand_id: string;
        email: string | null;
        phone: string | null;
        code: string | null;
        data: any | null;
        companyData: any | null;
      };
    };
  }
}

export const API_URL = window.WIDGET_CONFIG?.API_URL || 'http://localhost:4000';

export const getErxesSettings = () => window.erxesSettings || {};
