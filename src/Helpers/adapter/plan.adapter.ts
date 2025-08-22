import { PlanType, PlanResponseType } from "redux/app/types";
import { ManagePlanDataType } from "type";
import { Subscription } from "redux/app/types/subscription";
import { PlanDetails } from "../../Pages/Tenants/PlansTable";

/**
 *
 * @param plans : PlanType[] is the type of plans we get from the API
 * @returns ManagePlanDataType[] is the type of plans we want to display in the table
 */
export function adaptToPlan(plans: PlanType[]): ManagePlanDataType[] {
  return (
    plans?.map((plan: PlanType) => {
      return {
        id: plan.id,
        planName: plan.name,
        createdDate: plan.createdOn,
        price: plan.amount,
        status: plan.status,
        isCustomPlan: plan.isCustomPlan,
      };
    }) || []
  );
}

type Pricing = {
  name: string;
  amount: string;
  id: string;
};

type Feature = { name: string } & Record<string, { included: boolean }>;

export function adaptToPlanList(planData: PlanType[]): PlanResponseType {
  const result: {
    features: Array<Feature>;
    pricing: Pricing[];
  } = {
    features: [],
    pricing: [],
  };

  const featureMap = new Map<string, Feature>();
  const pricingSet = new Set<Pricing>();
  const allPlanNames = new Set<string>(); // Store all encountered plan names

  // Loop through each plan
  planData.forEach((plan) => {
    const planName = plan.name.toLowerCase(); // Derive plan name dynamically
    allPlanNames.add(planName); // Store all plan names

    // Store pricing details
    pricingSet.add({
      name: plan.name,
      amount: new Intl.NumberFormat("en-US").format(
        parseInt(plan.amount as string)
      ),
      id: plan.id,
    });

    // Loop through plan items
    plan.planItem.forEach((item) => {
      item.planValue.forEach((value) => {
        if (value.featureName) {
          const featureKey = value.featureName;

          // If feature does not exist, initialize it properly
          if (!featureMap.has(featureKey)) {
            featureMap.set(featureKey, { name: featureKey } as Feature);
          }

          // Get the existing feature object
          const featureEntry = featureMap.get(featureKey)!;

          // Dynamically add the planName as a key
          featureEntry[planName] = { included: true };

          // Update the map with the modified object
          featureMap.set(featureKey, featureEntry);
        }
      });
    });
  });

  // Ensure every feature has all plan names (default to { included: false })
  for (const feature of Array.from(featureMap.values())) {
    for (const planName of Array.from(allPlanNames)) {
      if (!(planName in feature)) {
        feature[planName] = { included: false };
      }
    }
  }

  // Convert featureMap values to an array
  result.features = Array.from(featureMap.values());

  // Convert pricingSet to an array
  result.pricing = Array.from(pricingSet);

  return result;
}

export function adaptToPlans(data: Subscription[] = []): PlanDetails[] {
  return data.map((item) => {
    const plan = item.plan ?? null;
    const billingCycle = plan?.billingCycle ?? null;

    return {
      planName: plan?.name ?? "Unknown Plan",
      customPlan: plan?.isCustomPlan ? "Yes" : "No",
      subscription: billingCycle?.cycleName ?? "Unknown",
      monthlyPricing: `${plan?.amount ?? "0.00"}`,
      status: item.status,
    };
  });
}
