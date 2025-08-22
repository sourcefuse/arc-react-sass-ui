import { colors } from "Providers/theme/colors";

export const dashboardStyles = {
  pageContainer: { flexDirection: "column" },
  backgroundBox: { height: "8.75rem" },
  mainContainer: {
    marginTop: -8,
    display: "flex",
    gap: 4,
    width: "100%",
    justifyContent: "space-around",
    padding: 2,
  },
  leftContainer: { width: "100%" },
  statsStack: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    marginBottom: 6,
    width: "100%",
    cursor: "pointer",
  },
  statsIcon: (iconColor: string) => ({
    color: iconColor,
    fontSize: "1.875rem",
  }),
  recentTableStack: {
    backgroundColor: "background.paper",
    p: 2.5,
    borderRadius: "0.5rem",
    flex: "0 0 70%",
    boxShadow: `0 0.25rem 1rem ${colors.shadow}`,
  },
  recentTitle: {
    color: "secondary.main",
    fontWeight: 700,
    fontSize: "1.125rem",
  },
  recentTable: { boxShadow: 0, p: 0 },
  recentBtnStack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  recentBtn: { color: "secondary.main", fontWeight: 400, fontSize: "0.875rem" },
  recentBtnIcon: { color: "primary.main", p: 0 },
  graphsSection: { display: "flex", flexDirection: "column", gap: 4 },
  graphContainer: {
    backgroundColor: "background.paper",
    p: 2,
    px: 4,
    borderRadius: "0.5rem",
    boxShadow: `0 0.25rem 1rem ${colors.shadow}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
};
