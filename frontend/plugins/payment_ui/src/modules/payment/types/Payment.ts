export interface IPayment {
  name: string;
  kind: string;
  status: string;
  config: any;
}

export interface IPaymentDocument extends IPayment, Document {
  _id: string;
}
