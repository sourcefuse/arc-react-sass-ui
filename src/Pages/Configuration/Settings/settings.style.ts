export const settingsStyle = {
  mainContainer: { display: "flex", flexDirection: "column", gap: 4 },
  backgroundContainer: { p: 2, px: 4 },
};

export const settingsFormStyles = {
  mainContainer: { flexDirection: "column", width: "90%" },
  formControl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    my: 2,
  },
  formLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: "0 0 40%",
  },
  formLabelText: {
    fontSize: "1.4rem",
    fontWeight: 500,
    maxWidth: "22rem",
    whiteSpace: "normal",
  },
  formTooltip: { ml: 1 },
  formInputContainer: { flex: "0 0 50%" },
  formInput: { fontSize: "1rem" },
  formMultiSelectInput: { fontSize: "1rem" },
  buttonContainer: {
    flexDirection: "row",
    display: "flex",
    width: "90%",
    justifyContent: "flex-end",
    py: 4,
  },
};
