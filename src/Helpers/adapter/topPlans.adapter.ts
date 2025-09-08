import { IPieData } from "Components/CustomPieChart/CustomPieChart";
import { Subscription } from "redux/app/types/subscription";

/**
 *
 * @param SubscriptionData : Subscriptions with plans from the API
 * @returns IPieData[] is the type for displaying graph.
 */
const FOUR = 4;
export function adaptToTopPlans(response: Subscription[]): IPieData[] {
  const topPlan: { [key: string]: { planName: string; count: number } } = {};
  if (response.length === 0) {
    return [];
  }
  response.forEach((item) => {
    if (Object.keys(topPlan).includes(item.planId)) {
      topPlan[item.planId].count += 1;
    } else {
      topPlan[item.planId] = {
        planName: item.plan.name,
        count: 1,
      };
    }
  });
  //   added here as it will not be used anywhere else
  const colorsArray = ["#AC93F3", "#84C1FF", "#E9E9F0", "#80DFC2"];
  const topSubscribedPlans = Object.entries(topPlan)
    .map(([_, value], index) => ({
      name: value.planName,
      value: value.count,
    }))
    .sort((a, b) => b.value - a.value)
    .map((plan, index) => ({
      ...plan,
      // Assign color in a repeating fashion
      color: colorsArray[index % FOUR],
    }));
  //   only taking top 4 plans
  return topSubscribedPlans.slice(0, 4);
}
