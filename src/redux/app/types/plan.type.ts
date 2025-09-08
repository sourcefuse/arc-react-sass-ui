import { BillingCycleType } from "./billingCycling.type";
import { FeatureMetadataNode } from "./feature.type";
import { TagType } from "./tag.type";

export enum PlanStatus {
  ACTIVE,
  SUSPENDED,
}
export interface PlanItemNode {
  deleted: boolean;
  deletedOn: Date;
  deletedBy: string;
  createdOn: Date;
  modifiedOn: Date;
  createdBy: string;
  modifiedBy: string;
  id: string;
  name: string;
  description: string;
  planItemType: number;
  planValue: FeatureMetadataNode[];
}

type BaseEntity = {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string | null;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
};

export type PlanValue = Record<string, string>;

export type PlanItem = BaseEntity & {
  name: string;
  planItemType: number;
  planValue: PlanValue[];
};

export type TClusterType = {
  id: string;
  label: string;
  description: string;
  deleted: boolean;
  deletedOn: string;
  deletedBy: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
};

export type ClusterType = BaseEntity & {
  clusterTypeId: string;
  region: string;
  zone: string;
  description: string;
  clusterType?: TClusterType;
};

type Tier = BaseEntity & {
  label: string;
  description: string;
};

export type CreatePlanItemPayload = Partial<Omit<PlanItemNode, "planValue">> &
  Pick<PlanItemNode, "name" | "planItemType"> & {
    planValue: { features: string[] };
  };
export type UpdatePlanItemByIdPayload = Partial<
  Omit<PlanItemNode, "planValue">
> &
  Pick<PlanItemNode, "name" | "planItemType" | "id"> & {
    planValue: { features: string[] };
  };
export type PlanType = {
  id: string;
  name: string;
  description?: string;
  amount: number | string;
  metadata: object;
  isCustomPlan: boolean;
  billingCycleId: string;
  currencyId: string;
  clusterId: string;
  deleted: boolean;
  deletedOn: string;
  deletedBy: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
  tier: Tier[];
  planItem: PlanItem[];
  cluster?: ClusterType;
  tag?: TagType[];
  billingCycle?: BillingCycleType;
  status: PlanStatus;
};

export type PlanResponseType = {
  features: Array<{ name: string } & Record<string, { included: boolean }>>;
  pricing: Array<{
    name: string;
    amount: string;
    id: string;
  }>;
};

export type PlanCustomResponseType = {
  id: string;
  name: string;
  amount: string;
  features: string[];
};

export type CreatePlan = Pick<
  PlanType,
  "name" | "isCustomPlan" | "billingCycleId" | "amount" | "clusterId"
> & {
  planItemIds: string[];
  tierId: string;
};

export type UpdatePlan = Pick<PlanType, "status" | "isCustomPlan" | "id">;

export type Currency = {
  id: string;
  currencyCode: string;
  currencyName: string;
  symbol: string | null;
  country: string;
};
