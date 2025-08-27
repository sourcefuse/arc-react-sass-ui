import Button from "Components/Button";
import DetailCard from "Components/DetailComponent/DetailCard";
import { useMemo } from "react";
import { useGetPlanItemByIdQuery } from "redux/app/planItemsApiSlice";
import { Section } from "types/modalView.types";
import CircularLoader from "Components/CircularLoader/CircularLoader";
import StatusChipSection from "Components/StatusChipSection/StatusChipSection";

interface IPlanItemProps {
  planItemId: string;
  handleCloseModal: () => void;
}

const PlanItemView: React.FC<IPlanItemProps> = ({
  planItemId,
  handleCloseModal,
}) => {
  const {
    data: planItemNode,
    isLoading,
    isFetching,
  } = useGetPlanItemByIdQuery(planItemId);

  const FeaturesSection = () => {
    const features = Array.from(
      planItemNode?.planValue.reduce((acc, node) => {
        acc.add(node.featureName);
        return acc;
      }, new Set<string>()) ?? []
    );
    return <StatusChipSection title="Features" data={features} />;
  };

  const infoSections = useMemo(() => {
    const planItemSection: Section = {
      title: "Plan Item Information",
      data: planItemNode
        ? [
            { label: "Plan Item Name", value: planItemNode?.name ?? "" },
            { label: "Description", value: planItemNode.description ?? "" },
          ]
        : [],
    };

    return [planItemSection];
  }, [planItemNode]);

  if (isLoading || isFetching) {
    return <CircularLoader />;
  }

  return (
    <div data-testid="plan-item-view">
      <DetailCard
        title="Plan Item Details"
        sections={infoSections}
        handleClose={handleCloseModal}
        extraContent={<FeaturesSection />}
        actions={
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={handleCloseModal}
            sx={{ minWidth: 110, minHeight: 40 }}
          >
            Close
          </Button>
        }
      ></DetailCard>
    </div>
  );
};

export default PlanItemView;
