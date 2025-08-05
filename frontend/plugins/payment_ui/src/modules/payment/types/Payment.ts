export interface IPayment {
  name: string;
  kind: string;
  status: string;
  config: any;
  createdAt: Date;
}

export interface IPaymentDocument extends IPayment, Document {
  _id: string;
}
