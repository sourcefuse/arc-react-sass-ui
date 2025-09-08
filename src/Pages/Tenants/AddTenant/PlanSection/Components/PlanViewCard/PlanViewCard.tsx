import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlanSelectedType } from "../../../addTenantsUtils";
import { formatAmount } from "Pages/Tenants/tenants.utils";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";

interface IPlanViewCardProps {
  plan: PlanSelectedType | undefined;
}
const PlanViewCard: React.FC<IPlanViewCardProps> = ({ plan }) => {
  if (!plan) {
    return <></>;
  }
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
      data-testid="plan-view-card"
    >
      <TruncatedTooltipText maxWidth={22} text={plan.name}>
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: "500",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {plan.name}
        </Typography>
      </TruncatedTooltipText>
      <Typography
        sx={{ fontSize: "1.25rem", fontWeight: "500", color: "primary.main" }}
      >
        ${formatAmount(plan.amount ?? 0)}
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", fontWeight: "400" }}>
        {plan.duration}
      </Typography>
    </Stack>
  );
};

export default PlanViewCard;
