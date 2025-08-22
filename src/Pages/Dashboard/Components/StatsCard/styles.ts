import { colors } from "Providers/theme/colors";

export const statsCardStyles = {
  mainContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "background.paper",
    p: 4,
    borderRadius: "0.5rem",
    boxShadow: `0 0.25rem 1rem ${colors.shadow}`,
  },
  dataTextContainer: { textAlign: "center" },
  dataText: { fontSize: "2.5rem", fontWeight: 400 },
  dataLabelText: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "customText.header",
  },
  iconContainer: (iconBgColor: string) => ({
    borderRadius: "50%",
    backgroundColor: iconBgColor,
    width: "4.25rem",
    height: "4.25rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
};
