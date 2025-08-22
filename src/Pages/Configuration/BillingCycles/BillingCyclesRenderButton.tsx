import RenderButton from "Components/RenderButton/RenderButton";
import { PermissionsEnum } from "Constants/enums";

interface IProps {
  refetch: () => void;
  handleCancel: () => void;
  showButtonLoader?: boolean;
}

function BillingCyclesRenderButton(props: Readonly<IProps>) {
  return (
    <RenderButton
      permissions={[
        PermissionsEnum.UpdateBillingCycle,
        PermissionsEnum.CreateBillingCycle,
      ]}
      {...props}
    />
  );
}

export default BillingCyclesRenderButton;
