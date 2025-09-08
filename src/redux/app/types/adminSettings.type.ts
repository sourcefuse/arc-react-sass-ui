import { TagType } from "./tag.type";
import { TierType } from "./tier.type";

export type AdminSettings = {
  id: string;
  observabilityUrl: string;
  rowsPerListing: number;
  leadAutoClose: number;
};
export type CombinedAdminSettings = {
  adminSettings: AdminSettings[];
  tags: TagType[];
  tiers: TierType[];
};
