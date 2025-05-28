export interface IAttachment {
  url: string;
  name: string;
}

export interface IPdfAttachment {
  pdf?: IAttachment;
  pages: IAttachment[];
}
