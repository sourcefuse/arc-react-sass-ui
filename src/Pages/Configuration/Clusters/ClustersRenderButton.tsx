import RenderButton from "Components/RenderButton/RenderButton";
import { PermissionsEnum } from "Constants/enums";

interface IProps {
  refetch: () => void;
  handleCancel: () => void;
  showButtonLoader?: boolean;
}

function ClustersRenderButton(props: Readonly<IProps>) {
  return (
    <RenderButton
      permissions={[
        PermissionsEnum.UpdateCluster,
        PermissionsEnum.CreateCluster,
      ]}
      {...props}
    />
  );
}

export default ClustersRenderButton;
