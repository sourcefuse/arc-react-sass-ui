import { convertToTitleCase } from "Helpers/utils";
import { PlanItem, PlanType } from "../../../../../../redux/app/types";

export interface IFeature {
  name: string;
}

export interface IPricingProps {
  featuresList: IFeature[];
  tagId: string;
  planData: PlanType[];
  billingCycle: string;
  onSelectPlan: (plan: PlanType, tagId: string, duration: string) => void;
  selectedPlanIdsForTag: string[];
  isPlanFetching: boolean;
  selectedPlanIds: string[];
}

export const renderPricingText = (billingCycle: string) => {
  return convertToTitleCase(billingCycle);
};

export const isIncluded = (featureName: string, planItem: PlanItem[]) => {
  let isPresent = false;
  planItem?.forEach((plan) => {
    plan.planValue?.forEach((value) => {
      if (value.featureName === featureName) isPresent = true;
    });
  });
  return isPresent;
};
