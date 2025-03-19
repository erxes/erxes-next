import { Document } from 'mongoose';

export interface IConformity {
  mainType: string;
  mainTypeId: string;
  relType: string;
  relTypeId: string;
}

export interface IConformityAdd {
  mainType: string;
  mainTypeId: string;
  relType: string;
  relTypeId: string;
}

export interface IConformityEdit {
  mainType: string;
  mainTypeId: string;
  relType: string;
  relTypeIds: string[];
}

export interface IConformitySaved {
  mainType: string;
  mainTypeId: string;
  relTypes: string[];
}

export interface IConformityRelated {
  mainType: string;
  mainTypeId: string;
  relType: string;
}

export interface IConformityChange {
  type: string;
  newTypeId: string;
  oldTypeIds: string[];
}

export interface IConformityFilter {
  mainType: string;
  mainTypeIds: string[];
  relType: string;
}

export interface IGetConformityBulk {
  mainType: string;
  mainTypeIds: string[];
  relTypes: string[];
}

export interface IConformityRemove {
  mainType: string;
  mainTypeId: string;
}

export interface IConformitiesRemove {
  mainType: string;
  mainTypeIds: string[];
}

export interface IConformityDocument extends IConformity, Document {
  _id: string;
}
