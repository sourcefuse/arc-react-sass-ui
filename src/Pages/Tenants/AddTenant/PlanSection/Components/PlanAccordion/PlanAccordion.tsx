import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import { colors } from "../../../../../../Providers/theme/colors";

export const PlanAccordion = styled((props: AccordionProps) => (
  <MuiAccordion elevation={0} square {...props} />
))(() => ({
  border: `solid ${colors.border} 0.081rem`,
  boxShadow: "none",
  borderRadius: "1.875rem !important",
  marginBlock: "0.875rem",
  "&::before": {
    display: "none",
  },
}));

export const PlanAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(() => ({
  [`& .${accordionSummaryClasses.root}`]: {
    borderRadius: "1.875rem",
  },
}));

export const PlanAccordionDetails = styled(MuiAccordionDetails)(
  ({ theme }) => ({
    padding: theme.spacing(2),
  })
);
