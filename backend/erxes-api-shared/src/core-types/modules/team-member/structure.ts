export interface IRule {
  kind: string;
  text: string;
  condition: string;
  value: string;
}

export interface IBrand {
  code?: string;
  name?: string;
  description?: string;
  userId?: string;
  emailConfig?: IBrandEmailConfig;
}

export interface IBrandDocument extends IBrand, Document {
  _id: string;
  emailConfig?: IBrandEmailConfigDocument;
  createdAt: Date;
}

export interface IRuleDocument extends IRule, Document {
  _id: string;
}

export interface IBrandEmailConfig {
  type?: string;
  template?: string;
}

export interface IBrandEmailConfigDocument
  extends IBrandEmailConfig,
    Document {}
