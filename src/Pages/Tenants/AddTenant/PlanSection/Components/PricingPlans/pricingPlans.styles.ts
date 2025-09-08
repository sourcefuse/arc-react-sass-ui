import { colors } from "../../../../../../Providers/theme/colors";

const SECTION_HEIGHT = 10;
const COLOR = "secondary.main";
export const pricingStyles = {
  noData: {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    text: { color: COLOR, fontWeight: 500, fontSize: "2rem" },
  },
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    maxWidth: "100%",
  },
  leftSectionContainer: {
    flex: "0 0 30%",
    mt: `${SECTION_HEIGHT + 1}rem`,
    ml: "0.5rem",
  },
  leftSection: {
    borderBottom: `0.063rem solid  ${colors.grayLight}`,
    marginLeft: "0.5rem",
    height: "2rem",
    paddingTop: "0.5rem",
  },
  rightSectionContainer: {
    display: "flex",
    overflowX: "auto",
    whiteSpace: "nowrap",
    gap: 2,
    p: 2,
    flex: 1,
    width: "44rem",
  },
  rightSection: (index: number) => ({
    display: "flex",
    flexDirection: "column",
    p: 2,
    minWidth: "12.5rem",
    flex: 0.5,
    textAlign: "center",
    borderRadius: "0.5rem",
    border: "0.063rem solid",
    borderColor: "primary.border",
    bgcolor: [colors.planOne, colors.planTwo, colors.planThree][index % 3],
  }),
  rightSectionCard: {
    minHeight: `${SECTION_HEIGHT}rem`,
    maxHeight: `${SECTION_HEIGHT}rem`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  selectionBtn: {
    borderRadius: "1.25rem",
    borderColor: "primary.p100",
    backgroundColor: "primary.main",
    color: "background.paper",
    marginBlock: "1.25rem",
  },
  selectPlanBtn: { color: "primary.main", backgroundColor: "background.paper" },
  featureListContainer: {
    justifyContent: "center",
    textAlign: "center",
    borderBottom: `0.063rem solid  ${colors.grayLight}`,
    marginLeft: "0.5rem",
    height: "2rem",
  },
  icon: { color: COLOR },
  nameSection: { fontWeight: "bold", whiteSpace: "pre-line", mb: 1 },
};
