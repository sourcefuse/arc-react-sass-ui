import { CellContext } from "@tanstack/react-table";
import { PlanItemNode } from "redux/app/types/plan.type";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router";
import { RouteConstant } from "Constants/routeConstant";
import { ActionButtons } from "Components/Button";
import Tooltip from "@mui/material/Tooltip";

interface IActionButtonProps {
  cellProps: CellContext<PlanItemNode, unknown>;
}
const ActionButton: React.FC<IActionButtonProps> = ({ cellProps }) => {
  const { row } = cellProps;
  const navigate = useNavigate();

  const handleEditBtn = () => {
    navigate(RouteConstant.CONFIGURATION_PLAN_ITEMS_EDIT_FUNC(row.original.id));
  };

  const actionBtns = [
    {
      icon: (
        <Tooltip title="Edit Plan Item">
          <EditOutlinedIcon color="secondary" sx={{ cursor: "pointer" }} />
        </Tooltip>
      ),
      handler: handleEditBtn,
      key: "edit",
    },
  ];

  return <ActionButtons actionBtns={actionBtns} />;
};

export default ActionButton;
