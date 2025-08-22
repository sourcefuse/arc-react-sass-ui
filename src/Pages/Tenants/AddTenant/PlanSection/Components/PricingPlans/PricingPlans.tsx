import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { PlanType } from "redux/app/types";
import { pricingStyles } from "./pricingPlans.styles";
import {
  IPricingProps,
  isIncluded,
  renderPricingText,
} from "./pricingPlans.utils";
import { formatAmount } from "Pages/Tenants/tenants.utils";
import { ChoosePlanStyle } from "../../ChoosePlanStyle";
import { TruncatedTooltipText } from "Components/TruncatedTooltip/TruncatedTooltip";

const PricingPlans: React.FC<IPricingProps> = ({
  featuresList,
  planData,
  billingCycle,
  onSelectPlan,
  tagId,
  selectedPlanIdsForTag,
  isPlanFetching,
  selectedPlanIds,
}) => {
  const onButtonClick = (plan: PlanType) => {
    onSelectPlan(plan, tagId, renderPricingText(billingCycle));
  };
  if (isPlanFetching) {
    return (
      <Box sx={ChoosePlanStyle.loaderContainer} data-testid="pricing-loader">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (planData.length === 0)
    return (
      <Stack sx={pricingStyles.noData.container}>
        <Typography sx={pricingStyles.noData.text}>
          No data to display!
        </Typography>
      </Stack>
    );

  return (
    <Grid container spacing={2} sx={pricingStyles.mainContainer}>
      {/* Left Section - Feature List */}
      <Grid item xs={3} sx={pricingStyles.leftSectionContainer}>
        <Button
          variant="outlined"
          fullWidth
          sx={{ ...pricingStyles.selectionBtn, visibility: "hidden" }}
        >
          hidden button
        </Button>
        {featuresList?.map((feature, index) => (
          <Box key={`${feature.name}-${index}`} sx={pricingStyles.leftSection}>
            <Typography variant="body2">{feature?.name}</Typography>
          </Box>
        ))}
      </Grid>

      {/* Right Section - Pricing Plans */}

      <Grid item xs={9} sx={pricingStyles.rightSectionContainer}>
        {planData
          .slice()
          .sort((a, b) => parseInt(`${a.amount}`) - parseInt(`${b.amount}`))
          .map((plan, index) => (
            <Box key={plan.id} sx={pricingStyles.rightSection(index)}>
              <Box sx={pricingStyles.rightSectionCard}>
                <TruncatedTooltipText maxWidth={22} text={plan.name}>
                  <Typography
                    variant="h6"
                    sx={{
                      ...pricingStyles.nameSection,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {plan.name}
                  </Typography>
                </TruncatedTooltipText>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  ${formatAmount(plan.amount)}
                </Typography>
                <Typography variant="caption">
                  {renderPricingText(billingCycle)}
                </Typography>
              </Box>
              {selectedPlanIdsForTag?.includes(plan.id) ? (
                <Button
                  variant="outlined"
                  fullWidth
                  sx={pricingStyles.selectionBtn}
                  onClick={() => onButtonClick(plan)}
                >
                  Plan Selected
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  fullWidth
                  data-testid={`select-plan-${plan.id}-${tagId}`}
                  sx={{
                    ...pricingStyles.selectionBtn,
                    ...pricingStyles.selectPlanBtn,
                  }}
                  onClick={() => onButtonClick(plan)}
                  disabled={selectedPlanIds?.includes(plan.id)}
                >
                  Select Plan
                </Button>
              )}
              {featuresList.map((feature, i) => (
                <Box
                  key={`${plan.name}-${i}`}
                  sx={pricingStyles.featureListContainer}
                >
                  {isIncluded(feature.name, plan.planItem) ? (
                    <Typography
                      sx={pricingStyles.icon}
                      data-testid="feature-checkIcon"
                    >
                      ✔
                    </Typography>
                  ) : (
                    <Typography
                      sx={pricingStyles.icon}
                      data-testid="feature-removeIcon"
                    >
                      -
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          ))}
      </Grid>
    </Grid>
  );
};

export default PricingPlans;
