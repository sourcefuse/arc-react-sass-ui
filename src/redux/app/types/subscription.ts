import { Cluster } from "Pages/Plans/utils";

export enum SubscriptionStatus {
  PENDING,
  ACTIVE,
  INACTIVE,
  CANCELLED,
  EXPIRED,
  PENDING_CANCELLATION,
}

export interface BillingCycle {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  cycleName: string;
  duration: number;
  durationUnit: string;
  description: string | null;
}

export interface Tier {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string | null;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  label: string;
  description: string;
}

export interface Tag {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  name: string;
}
export interface Plan {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  name: string;
  description: string;
  amount: string;
  metadata: unknown | null;
  isCustomPlan: boolean;
  billingCycleId: string;
  currencyId: string;
  clusterId: string | null;
  billingCycle: BillingCycle;
  cluster?: Cluster;
  tag?: Tag[];
}

export interface Subscription {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
  subscriberId: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  planId: string;
  tierId: string;
  clusterId: string;
  tenantId: string;
  plan: Plan;
  tier: Tier;
  tagId: string;
}
