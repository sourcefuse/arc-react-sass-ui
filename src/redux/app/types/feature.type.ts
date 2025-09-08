export enum EdBy {
  System = "system",
}

export enum Action {
  Install = "install",
  Skip = "SKIP",
}

export enum BlankRes {
  Yes = "yes",
}

export enum Domain {
  CRM = "CRM",
  Catalog = "Catalog",
  ClientApp = "ClientApp",
  Commerce = "Commerce",
  Cpq = "CPQ",
  Empty = "",
  PartyManagement = "party management",
  Rule = "rule",
  UserManagement = "user management",
}

export interface FeatureMetadataNode {
  name: string;
  paths: string;
  action: Action;
  domain: Domain;
  cpuLimit: null | string;
  memLimit: null | string;
  replicas: number;
  blank_res: BlankRes;
  cpuRequest: null | string;
  memRequest: null | string;
  featureName: string;
  featureVersion: string;
  chart_version: string;
  "ingress-rewrite-target": boolean;
}

export interface FeatureNode {
  deleted: boolean;
  deletedOn: null;
  deletedBy: null;
  createdOn: string;
  modifiedOn: Date;
  createdBy: string;
  modifiedBy: string;
  id: string;
  name: string;
  key: string;
  description: string;
  defaultValue: string;
  type: string;
  metadata: { data: FeatureMetadataNode[] };
}
