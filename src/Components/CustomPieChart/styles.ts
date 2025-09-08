import { colors } from "Providers/theme/colors";

export const pieChartStyles = {
  noDataContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  legendsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  legendValueContainer: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 2,
    width: "45%",
  },
  legendColor: (entryColor: string) => ({
    backgroundColor: entryColor,
    borderRadius: "50%",
    width: "0.625rem",
    height: "0.625rem",
  }),
  legendText: {
    color: colors.headerText,
    fontWeight: 400,
    fontSize: "0.875rem",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    width: "95%",
  },
};
