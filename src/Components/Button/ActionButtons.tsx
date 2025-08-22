import { Stack, IconButton } from "@mui/material";
import { ReactNode } from "react";

export interface ActionBtn {
  icon: ReactNode;
  handler: React.MouseEventHandler<HTMLButtonElement>;
  key: string;
}

interface IActionButtonsProps {
  actionBtns: ActionBtn[];
}
export const ActionButtons: React.FC<IActionButtonsProps> = ({
  actionBtns,
}) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      {actionBtns.map(({ icon, key, handler }) => (
        <IconButton key={key} onClick={handler}>
          {icon}
        </IconButton>
      ))}
    </Stack>
  );
};
