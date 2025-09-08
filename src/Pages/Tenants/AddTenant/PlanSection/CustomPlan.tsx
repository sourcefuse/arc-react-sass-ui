import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { CustomPlanStyle } from "./CustomPlanStyle";
import { PlanType } from "redux/app/types";
import {
  PlanAccordion,
  PlanAccordionDetails,
  PlanAccordionSummary,
} from "./Components/PlanAccordion";
import { ChoosePlanStyle } from "./ChoosePlanStyle";
import PlanViewCard from "./Components/PlanViewCard/PlanViewCard";
import { PlanSelectedType } from "../addTenantsUtils";
import { formatAmount } from "Pages/Tenants/tenants.utils";
import { pricingStyles } from "./Components/PricingPlans/pricingPlans.styles";
import StatusChip from "Components/StatusChip/StatusChip";
import { colors } from "Providers/theme/colors";

interface CustomPlanProps {
  onAccordionClick: (tagId: string, event?: React.SyntheticEvent) => void;
  renderSelectedPlan: (tagId: string) => PlanSelectedType | undefined;
  handleCustomPlanChange: (event: SelectChangeEvent) => void;
  customSelectedPlan: PlanType | undefined;
  expandedId: string | undefined;
  planData: PlanType[];
  isPlanFetching: boolean;
}

const CustomPlan: React.FC<CustomPlanProps> = ({
  onAccordionClick,
  renderSelectedPlan,
  customSelectedPlan,
  handleCustomPlanChange,
  expandedId,
  planData,
  isPlanFetching,
}) => {
  const renderPlanList = (plan: PlanType) => {
    return plan.planItem.map((item) => {
      return item.name;
    });
  };

  const renderPlanTag = (plan: PlanType) => {
    return plan.tag?.map((tag) => {
      return tag.name;
    });
  };

  const renderFeatureList = (plan: PlanType) => {
    const featuresList = plan.planItem.flatMap((item) => {
      return item.planValue.flatMap((planVal) => {
        return planVal.featureName;
      });
    });
    return Array.from(new Set(featuresList));
  };

  const renderContent = () => {
    if (isPlanFetching) {
      return (
        <Box sx={ChoosePlanStyle.loaderContainer} data-testid="pricing-loader">
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (planData.length === 0) {
      return (
        <Stack sx={pricingStyles.noData.container}>
          <Typography sx={pricingStyles.noData.text}>
            No data to display!
          </Typography>
        </Stack>
      );
    }

    return (
      <FormControl fullWidth>
        <InputLabel
          id="custom-plan-input"
          sx={CustomPlanStyle.labelStyle({ focused: !!customSelectedPlan?.id })}
        >
          Custom Plan
        </InputLabel>
        <Select
          labelId="custom-plan-select"
          id="custom-plan-select"
          label="Custom Plan"
          sx={CustomPlanStyle.inputStyles({})}
          value={customSelectedPlan?.id}
          onChange={handleCustomPlanChange}
          data-testid="custom-plan-select"
          inputProps={{ "aria-label": "Custom Select" }}
        >
          {planData.map((customPlan) => (
            <MenuItem
              key={customPlan.id}
              value={customPlan.id}
              data-testid={`menu-item-${customPlan.id}`}
            >
              {`${customPlan.name} - ${customPlan.billingCycle?.cycleName} - $${customPlan.amount}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <PlanAccordion
      expanded={expandedId === "customPlan"}
      data-testid={`accordion-customPlan`}
    >
      <PlanAccordionSummary onClick={(e) => e.stopPropagation()}>
        <Stack sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box alignItems="center" sx={ChoosePlanStyle.pointer}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={ChoosePlanStyle.headerLeftSelect}
                  checked={!!renderSelectedPlan("customPlan")}
                  onChange={(e) => onAccordionClick("customPlan", e)}
                />
              }
              sx={ChoosePlanStyle.headerLeftTypography}
              label={
                <Box
                  onClick={(e) => onAccordionClick("customPlan", e)}
                  sx={{ cursor: "pointer" }}
                >
                  {"Custom Plan"}
                </Box>
              }
            />
            {/* Render Selected Plan Details */}
          </Box>
          <Box
            onClick={() => onAccordionClick("customPlan")}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            data-testid={`tag-customPlan`}
          >
            <PlanViewCard plan={renderSelectedPlan("customPlan")} />
          </Box>
        </Stack>
      </PlanAccordionSummary>
      <PlanAccordionDetails sx={{ paddingInline: 6, paddingBottom: 6 }}>
        {renderContent()}
        {customSelectedPlan?.id && (
          <Stack
            sx={{ mt: 2 }}
            spacing={1}
            flexDirection="column"
            data-testid="custom-plan-card"
          >
            <Typography sx={CustomPlanStyle.typographyHeader}>
              Custom Plan Details
            </Typography>
            <Box
              sx={{
                padding: 2,
                mt: 1,
                backgroundColor: "background.secondaryDark",
                borderRadius: "1rem",
              }}
            >
              <Grid container spacing={2} sx={{ padding: 1 }}>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Plan Name
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {customSelectedPlan.name}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Subscription Type
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {customSelectedPlan.billingCycle?.cycleName}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Cluster
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {customSelectedPlan.cluster?.clusterType?.label}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Tier
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {customSelectedPlan.tier[0]?.label}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Amount
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    ${formatAmount(customSelectedPlan.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Tax
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    $0
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Discount
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    $0
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Plan Item
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {renderPlanList(customSelectedPlan).join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Tag
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {renderPlanTag(customSelectedPlan)?.join(", ") ?? ""}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={CustomPlanStyle.cardHeader} variant="body2">
                    Features List
                  </Typography>
                  <Typography sx={CustomPlanStyle.typographyDetails}>
                    {renderFeatureList(customSelectedPlan).map((name) => (
                      <Box key={name} sx={CustomPlanStyle.chipList}>
                        <StatusChip
                          label={`${name}`}
                          color={colors.primary100}
                        />
                      </Box>
                    ))}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        )}
      </PlanAccordionDetails>
    </PlanAccordion>
  );
};

export default CustomPlan;
