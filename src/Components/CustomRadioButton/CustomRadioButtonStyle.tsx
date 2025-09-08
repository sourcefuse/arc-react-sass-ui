const checkIcon = (iconSize: number) => {
  return { color: "white", fontSize: iconSize };
};

const radioStyle = ({
  getSize,
  checked,
  checkedColor,
  uncheckedColor,
}: {
  getSize: (size: string) => number | undefined;
  checked: boolean;
  checkedColor: string;
  uncheckedColor: string;
}) => {
  return {
    width: { xs: getSize("xs"), sm: getSize("sm"), md: getSize("md") },
    height: { xs: getSize("xs"), sm: getSize("sm"), md: getSize("md") },
    borderRadius: "50%",
    border: "0.125rem solid",
    borderColor: checked ? checkedColor : uncheckedColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    bgcolor: checked ? checkedColor : "background.paper",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: checkedColor,
    },
  };
};

export const CustomRadioButtonStyle = {
  checkIcon,
  radioStyle,
};
