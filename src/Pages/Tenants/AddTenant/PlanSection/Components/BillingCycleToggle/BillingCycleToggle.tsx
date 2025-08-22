import ToggleButton from "@mui/material/ToggleButton";
import {
  BillingCycleType,
  BillingTypes,
} from "Pages/Tenants/AddTenant/addTenantsUtils";
import { StyledToggleButtonGroup } from "./BillingCycleToggle.styles";

interface BillingCycleToggleProps {
  billingCycle: string;
  handleBillingChange: (billingCycle: BillingTypes, tagId: string) => void;
  tagId: string;
  billingData?: BillingCycleType[];
}

const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({
  billingCycle,
  handleBillingChange,
  tagId,
  billingData,
}) => {
  const handleBillingCycleChange = (
    event: React.MouseEvent<HTMLElement>,
    newBillingCycle: BillingTypes
  ) => {
    if (newBillingCycle !== null) {
      handleBillingChange(newBillingCycle, tagId);
    }
  };
  return (
    <StyledToggleButtonGroup
      value={billingCycle}
      exclusive
      onChange={handleBillingCycleChange}
      aria-label="billing-cycle"
    >
      {billingData
        ?.slice()
        .sort(
          (a: BillingCycleType, b: BillingCycleType) => a.duration - b.duration
        )
        ?.map((item: BillingCycleType) => (
          <ToggleButton
            key={item.cycleName.toLowerCase()}
            value={item.cycleName.toLowerCase()}
            data-testid={`${item.cycleName.toLowerCase()}-cycle-${tagId}`}
            sx={{ whiteSpace: "nowrap" }}
          >
            {item.cycleName}
          </ToggleButton>
        ))}
    </StyledToggleButtonGroup>
  );
};

export default BillingCycleToggle;
