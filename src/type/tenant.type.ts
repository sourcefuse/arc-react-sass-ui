import { ContactType, TenantStatus } from "redux/app/types";
import { Subscription } from "redux/app/types/subscription";

export interface IFile {
  id: string;
  tenantId: string;
  fileKey: string;
  originalName: string;
  source: number;
  size: number;
  url: string;
}
export type Message = {
  stageName: string;
  stageStatus: string;
};
export type Log = {
  createdOn: string;
  message: Message;
  tenantId?: string;
};

export type TenantDataType = {
  tenantId: string;
  tenantName: string;
  status: TenantStatus;
  createdDate: string;
  planName: string;
  billingDate: string;
  updatedAt: string;
  lang: string;
  contacts?: ContactType[];
  subscriptions?: Subscription[];
  tier?: string;
  key: string;
  files?: IFile[];
};

export type TenantAndLogsDataType = TenantDataType & { logs?: Log[] };
