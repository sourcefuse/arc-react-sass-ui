import { TierSelectBoxType, TierType } from "redux/app/types";

export function adaptToTierSelect(tiers: TierType[]): TierSelectBoxType[] {
  return (
    tiers.map((tier: TierType) => {
      return {
        label: tier.label,
        value: tier.id,
      };
    }) || []
  );
}
