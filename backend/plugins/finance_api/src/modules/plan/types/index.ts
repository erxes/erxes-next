import { Document } from 'mongoose';

export type IPlan = {
  name: string;

  createdBy?: string;
  updatedBy?: string;
};

export type IPlanDocument = IPlan & Document;

export type IPlanFilterQuery = {
  name?: string;
};

export type IPlanMutationQuery = {
  name?: string;
};
