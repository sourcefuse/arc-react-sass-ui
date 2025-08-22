export enum LeadStatus {
  OPEN = "open",
  CONFIRMED = "confirmed",
  CLOSED = "closed",
  AUTO_CLOSED = "auto_closed",
  INVALID = "invalid",
}

export const leadStatusMap: Record<number, LeadStatus> = {
  0: LeadStatus.OPEN,
  1: LeadStatus.CONFIRMED,
  2: LeadStatus.CLOSED,
  3: LeadStatus.AUTO_CLOSED,
  4: LeadStatus.INVALID,
};
