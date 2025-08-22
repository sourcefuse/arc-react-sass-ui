const styles = {
  link: {
    height: "45px",
    borderRadius: "28px",
    width: "90%",
    "&:hover": {
      backgroundColor: "primary.p50",
    },
  },
  linkListActive: { backgroundColor: "primary.p100" },
  linkText: {
    fontWeight: "400 !important",
    color: "secondary.main",
    fontSize: 14,
    lineHeight: 16,
  },
  linkTextActive: {},
  listItemIcon: { color: "secondary.icon", minWidth: 40 },
  linkItemIconActive: {
    color: `secondary.main`,
  },
  divider: { marginTop: 1, marginBottom: 1, height: 2 },
  title: { paddingX: 1, textTransform: "uppercase", fontWeight: "bold" },
};

export default styles;
