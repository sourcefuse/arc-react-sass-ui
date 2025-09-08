import { PlanStatus } from "redux/app/types";

export type ManagePlanDataType = {
  id: string;
  planName: string;
  createdDate: string;
  price: number | string;
  status: PlanStatus;
  isCustomPlan: boolean;
};
