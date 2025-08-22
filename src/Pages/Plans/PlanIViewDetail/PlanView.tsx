import Button from "Components/Button";
import DetailCard from "Components/DetailComponent/DetailCard";
import { useEffect, useMemo, useState } from "react";
import {
  useGetPlanByIdQuery,
  useLazyGetPlanItemByIdQuery,
} from "redux/app/configurationApiSlice";
import { Section } from "types/modalView.types";
import CircularLoader from "Components/CircularLoader/CircularLoader";
import {
  getPlansByIdFilter,
  transformToUpdatePlanFormValues,
  UpdatePlanFormValues,
} from "../utils";
import StatusChipSection from "Components/StatusChipSection/StatusChipSection";
import {
  useGetBillingCyclesQuery,
  useGetClustersSelectQuery,
  useGetTagsQuery,
  useGetTiersQuery,
} from "redux/app/tenantManagementApiSlice";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { BillingCycleType, TagType, TierSelectBoxType } from "redux/app/types";
import { colors } from "Providers/theme/colors";
import { SelectNode } from "Components/Input/Input";

interface IPlanProps {
  planId: string;
  handleCloseModal: () => void;
}

const filter = { limit: 10000, offset: 0 };

const usePlanData = (planId: string) => {
  const {
    data: planData,
    isLoading,
    isFetching,
  } = useGetPlanByIdQuery({ id: planId, filter: getPlansByIdFilter });
  const { data: tierData, isLoading: isTierLoading } = useGetTiersQuery({});
  const { data: clusterData } = useGetClustersSelectQuery(filter);
  const { data: billingData } = useGetBillingCyclesQuery(filter);
  const { data: tagsData, isLoading: isTagsLoading } = useGetTagsQuery(filter);

  return {
    planData,
    tierData,
    clusterData,
    billingData,
    tagsData,
    isLoading: isLoading || isFetching || isTierLoading || isTagsLoading,
  };
};

interface PlanInformationSectionProps {
  planDataTransformed: UpdatePlanFormValues;
  clusterData?: TierSelectBoxType[];
  tierData?: TierSelectBoxType[];
  billingData?: BillingCycleType[];
}

const PlanInformationSection = ({
  planDataTransformed,
  clusterData,
  tierData,
  billingData,
}: PlanInformationSectionProps) => {
  const planSection: Section = {
    title: "Plan Information",
    data: [
      { label: "Plan Name", value: planDataTransformed.name ?? "" },
      { label: "Amount", value: planDataTransformed.amount ?? "" },
      {
        label: "Cluster Name",
        value:
          clusterData?.find(
            (cluster) => cluster.value === planDataTransformed.clusterId
          )?.label ?? "",
      },
      {
        label: "Tier Name",
        value:
          tierData?.find((tier) => tier.value === planDataTransformed.tierId)
            ?.label ?? "",
      },
      {
        label: "Billing Cycle",
        value:
          billingData?.find(
            (item) => item.id === planDataTransformed.billingCycleId
          )?.cycleName ?? "",
      },
    ],
  };

  return [planSection];
};

const ExtraContent: React.FC<{
  planDataTransformed: UpdatePlanFormValues | undefined;
  tagsData: TagType[] | undefined;
  handlePlanItemClick?: (item: SelectNode) => void;
}> = ({ planDataTransformed, tagsData, handlePlanItemClick }) => (
  <>
    <StatusChipSection
      title="Plan Tags"
      data={
        planDataTransformed?.planTagIds.map(
          (tagId) => tagsData?.find((tag) => tag.id === tagId)?.name ?? ""
        ) ?? []
      }
    />
    <StatusChipSection
      title="Plan Items"
      clickableChipData={planDataTransformed?.planItemIds}
      handleOnClick={handlePlanItemClick}
    />
  </>
);

const PlanView: React.FC<IPlanProps> = ({ planId, handleCloseModal }) => {
  const { planData, tierData, clusterData, billingData, tagsData, isLoading } =
    usePlanData(planId);
  const [planDataTransformed, setPlanDataTransformed] =
    useState<UpdatePlanFormValues>();
  const [selectedPlanItem, setSelectedPlanItem] = useState<SelectNode>();
  const [featuresData, setFeaturesData] = useState<string[]>([]);

  const [
    getPlanItems,
    { data: planItemNode, isFetching: isPlanItemsFetching },
  ] = useLazyGetPlanItemByIdQuery();

  useEffect(() => {
    if (!planData) return;
    const planDataTransform = transformToUpdatePlanFormValues(planData);
    setPlanDataTransformed(planDataTransform);
    const firstPlanItem = planDataTransform.planItemIds[0];
    setSelectedPlanItem(firstPlanItem);
    getPlanItems(firstPlanItem?.value ?? "");
  }, [getPlanItems, planData]);

  const infoSections = useMemo(() => {
    if (!planDataTransformed) return [];
    return PlanInformationSection({
      planDataTransformed,
      clusterData,
      tierData,
      billingData,
    });
  }, [planDataTransformed, clusterData, tierData, billingData]);

  useEffect(() => {
    const features = Array.from(
      planItemNode?.planValue?.reduce((acc, node) => {
        acc.add(`${node.name} (${node.chart_version})`);
        return acc;
      }, new Set<string>()) ?? []
    );
    setFeaturesData(features);
  }, [planItemNode]);

  const handlePlanItemClick = (item: SelectNode) => {
    getPlanItems(item.value ?? "");
    setSelectedPlanItem(item);
  };

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div data-testid="plan-view">
      <DetailCard
        title="Plan Details"
        sections={infoSections}
        handleClose={handleCloseModal}
        extraContent={
          <>
            <ExtraContent
              planDataTransformed={planDataTransformed}
              tagsData={tagsData}
              handlePlanItemClick={handlePlanItemClick}
            />

            <Box ml={2} minHeight={100}>
              {featuresData?.length === 0 || isPlanItemsFetching ? (
                <Stack direction="column" spacing={1} mt={2}>
                  <Skeleton
                    variant="rounded"
                    width="15%"
                    height={20}
                    data-testid="loader"
                  />
                  <Stack direction={"row"} flexWrap={"wrap"}>
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const uniqueKey = `skeleton-loader-${idx}`;
                      return (
                        <Skeleton
                          key={uniqueKey}
                          variant="rounded"
                          width="15%"
                          height={20}
                          sx={{ margin: 1 }}
                          data-testid="loader"
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              ) : (
                <StatusChipSection
                  title={`Features (${selectedPlanItem?.label})`}
                  data={featuresData}
                  chipColor={colors.featuresChip}
                  isLowerCase={true}
                />
              )}
            </Box>
          </>
        }
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
      />
    </div>
  );
};

export default PlanView;
