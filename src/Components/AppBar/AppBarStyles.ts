export const appBarStyles = {
  menuButton: {
    borderRadius: "3.125rem", // 3.125rem to rem
    color: "secondary.icon",
    padding: "0.313rem 1.25rem",
    textTransform: "capitalize",
    "& .MuiSvgIcon-root": { fontSize: "2.125rem" }, // 34px to rem
    "& .MuiButton-endIcon .MuiSvgIcon-root": {
      fontSize: "1.25rem", // 20px to rem
    },
  },
  menuButtonBox: {
    minWidth: "fit-content",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    color: "secondary.main",
    fontWeight: 400,
    textAlign: "left",
  },
  menu: {
    "& .MuiPaper-root": {
      width: "12.5rem", // 200px to rem
      paddingInline: "0.125rem", // 2px to rem
      "& .MuiMenuItem-root": {
        borderRadius: "1.75rem", // 28px to rem
        fontWeight: "400 !important",
        color: "secondary.main",
        fontSize: "1rem", // 16px to rem
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
  },
};
