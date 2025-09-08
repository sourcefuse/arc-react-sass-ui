import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
} from "@mui/material";
import { FormikValues, useFormikContext } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import {
  useGetClustersQuery,
  useLazyGetBillingCyclesQuery,
  useLazyGetPlansForTenantQuery,
  useLazyGetTagsQuery,
} from "redux/app/tenantManagementApiSlice";
import { PlanType, TagType } from "redux/app/types";
import {
  BillingTypes,
  PlanSelectedType,
  billingDefaultData,
} from "../addTenantsUtils";
import { ChoosePlanStyle } from "./ChoosePlanStyle";
import BillingCycleToggle from "./Components/BillingCycleToggle";
import {
  PlanAccordion,
  PlanAccordionDetails,
  PlanAccordionSummary,
} from "./Components/PlanAccordion";
import PlanViewCard from "./Components/PlanViewCard/PlanViewCard";
import PricingPlans from "./Components/PricingPlans/PricingPlans";
import { CustomPlanStyle } from "./CustomPlanStyle";
import CustomPlan from "./CustomPlan";
import ChoosePlanLoader from "./ChoosePlanLoader";

interface ChoosePlanProps {
  handleNextButton: (enabled: boolean) => void;
  onChangeCluster: (cluster: string) => void;
  cluster: string;
  overAllPlans: PlanSelectedType[];
  onHandlePlan: (plan: PlanSelectedType[]) => void;
  customSelectedPlan: PlanType | undefined;
  onHandleCustomPlan: (plan: PlanType | undefined) => void;
  isEdit?: boolean;
}

type BillingCycleType = {
  id: string;
  cycleName: string;
  duration: number;
  durationUnit: string;
  description: string;
  deleted: boolean;
  deletedOn: string;
  deletedBy: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
};

type BillCycleType = {
  tagId: string | undefined;
  cycleId: string | undefined;
  name: string | undefined;
};

const limit = 20;
const offset = 0;

const ChoosePlan: React.FC<ChoosePlanProps> = (props) => {
  const { cluster, customSelectedPlan, isEdit } = props;

  const {
    focused,
    commonFeaturesList,
    clusterData,
    isClusterLoading,
    isTagsLoading,
    isPlanFetching,
    handleBillingChange,
    handleClusterChange,
    passCorrectBillCyclePerTag,
    passSelectPlansPerTag,
    onSelectPlan,
    renderSelectedPlan,
    handleCustomPlanChange,
    getAllSelectedPlanIds,
    onAccordionClick,
    setFocused,
    tagsData,
    expandedId,
    planData,
    billingData,
    overAllBillingCycle,
  } = usePlanManagement(props);

  const isLoading = !overAllBillingCycle.length && isEdit;

  if (isLoading) {
    return <ChoosePlanLoader />;
  }

  return (
    <Grid container sx={ChoosePlanStyle.girdContainer} spacing={3}>
      {/* Plan Selection (Retail, CPQ, Custom) */}
      <Grid item xs={12} sm={4}>
        <ClusterTypeSelect
          isClusterLoading={isClusterLoading}
          cluster={cluster}
          handleClusterChange={handleClusterChange}
          clusterData={clusterData}
          isEdit={isEdit}
          focused={focused}
          setFocused={setFocused}
        />
      </Grid>
      <Grid item xs={12}>
        {tagsData?.length && <Divider />}
      </Grid>
      <Grid item xs={12}>
        {isTagsLoading && (
          <Box sx={ChoosePlanStyle.loaderContainer}>
            <CircularProgress size={24} />
          </Box>
        )}
        {tagsData?.map((tag) => (
          <PlanAccordionSection
            key={tag.id}
            tag={tag}
            expandedId={expandedId}
            renderSelectedPlan={renderSelectedPlan}
            onAccordionClick={onAccordionClick}
            handleBillingChange={handleBillingChange}
            passCorrectBillCyclePerTag={passCorrectBillCyclePerTag}
            commonFeaturesList={commonFeaturesList}
            planData={planData}
            onSelectPlan={onSelectPlan}
            passSelectPlansPerTag={passSelectPlansPerTag}
            isPlanFetching={isPlanFetching}
            getAllSelectedPlanIds={getAllSelectedPlanIds}
            billingData={billingData}
          />
        ))}
        {cluster && !isTagsLoading && (
          <CustomPlan
            onAccordionClick={onAccordionClick}
            renderSelectedPlan={renderSelectedPlan}
            handleCustomPlanChange={handleCustomPlanChange}
            customSelectedPlan={customSelectedPlan}
            expandedId={expandedId}
            isPlanFetching={isPlanFetching}
            planData={planData?.length ? planData : []}
          ></CustomPlan>
        )}
      </Grid>
    </Grid>
  );
};

export default ChoosePlan;

interface ClusterTypeSelectProps {
  isClusterLoading: boolean;
  cluster: string;
  handleClusterChange: (event: SelectChangeEvent) => void;
  clusterData?: Array<{ value: string; label: string }>;
  isEdit?: boolean;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

const ClusterTypeSelect = ({
  cluster,
  focused,
  handleClusterChange,
  isClusterLoading,
  setFocused,
  clusterData,
  isEdit,
}: ClusterTypeSelectProps) => {
  return (
    <>
      {isClusterLoading && (
        <FormControl fullWidth>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="rectangular" height={40} />
        </FormControl>
      )}
      {!isClusterLoading && (
        <FormControl fullWidth>
          <InputLabel
            id="cluster-type-input"
            sx={CustomPlanStyle.labelStyle({ focused })}
          >
            Cluster Type
          </InputLabel>
          <Select
            labelId="cluster-type-select"
            id="cluster-type-select"
            value={cluster}
            label="Cluster Type"
            sx={CustomPlanStyle.inputStyles({})}
            onChange={handleClusterChange}
            onFocus={() => setFocused(true)}
            data-testid="cluster-type-select"
            inputProps={{ "aria-label": "Cluster Type" }}
            disabled={isEdit}
          >
            {clusterData?.map((clusterNode) => {
              return (
                <MenuItem
                  key={clusterNode.value}
                  value={clusterNode.value}
                  data-testid={`menu-item-${clusterNode.value}`}
                >
                  {clusterNode.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
};

interface PlanAccordionSectionProps {
  tag: TagType;
  expandedId: string | undefined;
  renderSelectedPlan: (tagId: string) => PlanSelectedType | undefined;
  onAccordionClick: (tagId: string, event?: React.SyntheticEvent) => void;
  handleBillingChange: (value: BillingTypes, tagId: string) => void;
  passCorrectBillCyclePerTag: (tagId: string) => string;
  commonFeaturesList: { name: string }[];
  planData: PlanType[] | undefined;
  onSelectPlan: (
    selectedPlan: PlanType,
    tagId: string,
    duration: string
  ) => void;
  passSelectPlansPerTag: (tagId: string) => string[];
  isPlanFetching: boolean;
  getAllSelectedPlanIds: () => string[];
  billingData?: BillingCycleType[];
}

const PlanAccordionSection = (props: PlanAccordionSectionProps) => {
  const {
    commonFeaturesList,
    expandedId,
    getAllSelectedPlanIds,
    handleBillingChange,
    isPlanFetching,
    onSelectPlan,
    passCorrectBillCyclePerTag,
    passSelectPlansPerTag,
    planData,
    renderSelectedPlan,
    onAccordionClick,
    tag,
  } = props;
  return (
    <PlanAccordion
      key={tag.id}
      expanded={expandedId === tag.id}
      data-testid={`accordion-${tag.id}`}
    >
      <PlanAccordionSummary onClick={(e) => e.stopPropagation()}>
        <Stack sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box alignItems="center" sx={ChoosePlanStyle.pointer}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={ChoosePlanStyle.headerLeftSelect}
                  checked={!!renderSelectedPlan(tag.id)}
                  onChange={(e) => onAccordionClick(tag.id, e)}
                />
              }
              sx={ChoosePlanStyle.headerLeftTypography}
              label={
                <Box
                  onClick={(e) => onAccordionClick(tag.id, e)}
                  sx={{ cursor: "pointer" }}
                >
                  {tag.name}
                </Box>
              }
            />
          </Box>
          <Box
            onClick={() => onAccordionClick(tag.id)}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            data-testid={`tag-${tag.id}`}
          >
            {/* Render Selected Plan Details */}
            <PlanViewCard plan={renderSelectedPlan(tag.id)} />
          </Box>
          <Box>
            <BillingCycleToggle
              handleBillingChange={handleBillingChange}
              billingCycle={passCorrectBillCyclePerTag(tag.id)}
              tagId={tag.id}
              billingData={props.billingData}
            />
          </Box>
        </Stack>
      </PlanAccordionSummary>
      <PlanAccordionDetails>
        <PricingPlans
          tagId={tag.id}
          featuresList={commonFeaturesList?.length ? commonFeaturesList : []}
          planData={planData?.length ? planData : []}
          billingCycle={passCorrectBillCyclePerTag(tag.id)}
          onSelectPlan={onSelectPlan}
          selectedPlanIdsForTag={passSelectPlansPerTag(tag.id)}
          isPlanFetching={isPlanFetching}
          selectedPlanIds={getAllSelectedPlanIds()}
        ></PricingPlans>
      </PlanAccordionDetails>
    </PlanAccordion>
  );
};

const useBillingCycleManagement = (
  overAllPlans: PlanSelectedType[],
  billingData?: BillingCycleType[]
) => {
  const [overAllBillingCycle, setOverAllBillingCycle] = useState<
    BillCycleType[]
  >([]);
  const initializedRef = useRef(false);

  const updateBillingCycle = (tagId: string, value: string) => {
    const selectedBill = billingData?.find(
      (x) => x.cycleName.toLowerCase() === value.toLowerCase()
    );

    setOverAllBillingCycle((prev) => {
      const billingCycleExists = prev.find((plan) => plan.tagId === tagId);

      if (billingCycleExists) {
        return prev.map((billCycle) =>
          billCycle.tagId === tagId
            ? { ...billCycle, name: value, cycleId: selectedBill?.id }
            : billCycle
        );
      }

      return [...prev, { tagId, name: value, cycleId: selectedBill?.id }];
    });

    return selectedBill;
  };

  useEffect(() => {
    if (initializedRef.current || !billingData || overAllPlans.length === 0)
      return;

    const enrichedBillingData = billingData.map((bill) => {
      const matchingPlans = overAllPlans.filter(
        (plan) => plan.billingCycleId === bill.id
      );
      const planIds = matchingPlans.map((plan) => plan.planId);
      return {
        ...bill,
        planIds,
      };
    });

    const initialBillingCycles = enrichedBillingData.map((bill) => {
      const matchingPlan = overAllPlans.find(
        (plan) =>
          plan.billingCycleId === bill.id && bill.planIds.includes(plan.planId)
      );

      return {
        tagId: matchingPlan?.tagId ?? undefined,
        name: bill.cycleName,
        cycleId: bill.id,
      };
    });

    setOverAllBillingCycle(initialBillingCycles);
    initializedRef.current = true;
  }, [billingData, overAllPlans]);

  return { overAllBillingCycle, setOverAllBillingCycle, updateBillingCycle };
};

const usePlanSelection = (props: ChoosePlanProps) => {
  const { overAllPlans, onHandleCustomPlan, onHandlePlan, handleNextButton } =
    props;
  const { setValues } = useFormikContext<FormikValues>();
  const [
    getPlans,
    {
      data: planData,
      isError: planItemsFetchError,
      isFetching: isPlanFetching,
    },
  ] = useLazyGetPlansForTenantQuery();

  const onSelectPlan = (
    selectedPlan: PlanType,
    tagId: string,
    duration: string
  ) => {
    let planExistsForTag = false;
    let planRemoved = false;

    const updatedPlans = overAllPlans.reduce((acc, plan) => {
      if (plan.tagId === tagId && plan.planId === selectedPlan.id) {
        // If the same plan for the same tag is selected again, remove it (deselect)
        planRemoved = true;
        return acc; // Skip adding this plan
      }

      // If the user chooses standard plans then we need to remove custom plan
      if (plan.tagId === "customPlan") {
        onHandleCustomPlan(undefined);
        return acc;
      }

      if (plan.tagId === tagId) {
        // Mark that a plan exists for this tag
        planExistsForTag = true;

        // Replace the plan for this tag with the new one
        acc.push({
          ...plan,
          name: selectedPlan.name,
          planId: selectedPlan.id,
          duration,
          amount: selectedPlan.amount,
        });
      } else {
        // Keep all other plans unchanged
        acc.push(plan);
      }

      return acc;
    }, [] as PlanSelectedType[]);

    if (!planExistsForTag && !planRemoved) {
      // If the plan doesn't exist, add it
      updatedPlans.push({
        tagId,
        name: selectedPlan.name,
        planId: selectedPlan.id,
        duration,
        amount: selectedPlan.amount,
        billingCycleId: selectedPlan.billingCycleId,
      });
    }

    onHandlePlan(updatedPlans);

    handleNextButton(false);
    setValues((prevValues) => ({
      ...prevValues,
      selectedPlans: updatedPlans,
    }));
  };

  const handleCustomPlanChange = (event: SelectChangeEvent) => {
    const selectedPlan = planData?.find((x) => x.id === event.target.value);
    if (selectedPlan) {
      onHandleCustomPlan(selectedPlan);
    }

    const plan = [
      {
        tagId: "customPlan",
        name: selectedPlan?.name,
        planId: selectedPlan?.id,
        duration: "",
        amount: selectedPlan?.amount,
        billingCycleId: selectedPlan?.billingCycleId,
      },
    ];

    onHandlePlan(plan);
    handleNextButton(false);
    setValues((prevValues) => ({
      ...prevValues,
      selectedPlans: plan,
    }));
  };

  return {
    getPlans,
    planData,
    handleCustomPlanChange,
    onSelectPlan,
    planItemsFetchError,
    isPlanFetching,
  };
};

const usePlanManagement = (props: ChoosePlanProps) => {
  const {
    cluster,
    handleNextButton,
    onChangeCluster,
    onHandlePlan,
    overAllPlans,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { values, setValues } = useFormikContext<FormikValues>();
  const [focused, setFocused] = useState(false);
  const [commonFeaturesList, setCommonFeaturesList] = useState<
    { name: string }[]
  >([]);
  const {
    getPlans,
    planData,
    handleCustomPlanChange,
    isPlanFetching,
    onSelectPlan,
    planItemsFetchError,
  } = usePlanSelection(props);

  const {
    data: clusterData,
    isError: clusterFetchError,
    isLoading: isClusterLoading,
  } = useGetClustersQuery({ limit, offset });
  const [
    getTags,
    { data: tagsData, isError: tagFetchError, isLoading: isTagsLoading },
  ] = useLazyGetTagsQuery();
  const [getBillingCycle, { data: billingData, isError: billingFetchError }] =
    useLazyGetBillingCyclesQuery();

  const { overAllBillingCycle, setOverAllBillingCycle, updateBillingCycle } =
    useBillingCycleManagement(overAllPlans, billingData);

  useEffect(() => {
    const errorList = [
      { error: clusterFetchError, message: "Failed to get cluster!" },
      { error: tagFetchError, message: "Failed to get tags!" },
      { error: planItemsFetchError, message: "Failed to get plan Items!" },
      { error: billingFetchError, message: "Failed to get billing cycle!" },
    ];
    errorList.forEach(({ error, message }) => {
      if (error) {
        enqueueSnackbar(message, { variant: "error" });
      }
    });
  }, [
    billingFetchError,
    clusterFetchError,
    enqueueSnackbar,
    planItemsFetchError,
    tagFetchError,
  ]);

  useEffect(() => {
    const hasNoPlans = overAllPlans.length === 0;
    if (hasNoPlans) {
      handleNextButton(true);
    }
  }, [handleNextButton, overAllPlans]);

  useEffect(() => {
    const hasCluster = cluster !== "";
    const hasNoTags = !tagsData?.length;

    if (hasCluster && hasNoTags) {
      getTags({ limit, offset });
      getBillingCycle({ limit, offset });
      setFocused(true);
    }
  }, [getTags, tagsData, getBillingCycle, cluster]);

  const handleBillingChange = (value: BillingTypes, tagId: string) => {
    setExpandedId(tagId);

    const selectedBill = updateBillingCycle(tagId, value);
    getPlans({
      limit,
      isCustomPlan: false,
      offset,
      tierId: values.tier?.value,
      clusterTypeId: cluster,
      billingCycleId: selectedBill?.id,
      tagId,
      sortBy: ["amount ASC"],
    });
  };

  const handleClusterChange = async (event: SelectChangeEvent) => {
    const clusterValue = event.target.value;
    onChangeCluster(clusterValue);
    setOverAllBillingCycle([]);
    onHandlePlan([]);
    setExpandedId("");
    setValues((prevValues) => ({
      ...prevValues,
      clusterId: event.target.value,
    }));
    getTags({ limit, offset });
    getBillingCycle({ limit, offset });
  };

  // expanded state
  const [expandedId, setExpandedId] = useState<TagType["id"]>();

  const passCorrectBillCyclePerTag = (tagId: string) => {
    const rec = overAllBillingCycle.find((x) => x.tagId === tagId);

    return rec?.name?.toLocaleLowerCase() ?? billingDefaultData.Monthly;
  };

  const passSelectPlansPerTag = (tagId: string) => {
    return overAllPlans.reduce<string[]>((acc, plan) => {
      const isMatchingTag = plan.tagId === tagId;
      if (isMatchingTag && plan.planId) {
        acc.push(plan.planId);
      }
      return acc;
    }, []);
  };

  const renderSelectedPlan = (tagId: string): PlanSelectedType | undefined => {
    return overAllPlans.find((x) => x.tagId === tagId);
  };

  const onAccordionClick = (tagId: string, event?: React.SyntheticEvent) => {
    // Prevent multiple calls and event propagation
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Prevent calling if already expanded
    if (expandedId === tagId) {
      setExpandedId("");
      return;
    }

    let currentBillId;
    let isCustomPlanStatus = false;

    if (tagId === "customPlan") {
      isCustomPlanStatus = true;
    }

    const currentCycle = overAllBillingCycle.find((x) => x.tagId === tagId);
    currentBillId = currentCycle?.cycleId;

    if (!currentBillId) {
      const selectedBill = updateBillingCycle(tagId, BillingTypes.Monthly);
      currentBillId = selectedBill?.id;
    }

    setExpandedId(tagId);

    getPlans({
      limit,
      offset,
      isCustomPlan: isCustomPlanStatus,
      tierId: values.tier?.value,
      clusterTypeId: cluster,
      ...(isCustomPlanStatus ? {} : { billingCycleId: currentBillId, tagId }),
      sortBy: ["amount ASC"],
    });
  };
  useEffect(() => {
    const features =
      planData?.flatMap(({ planItem }) =>
        planItem.flatMap(({ planValue }) => planValue)
      ) ?? [];
    const commonSet = Array.from(
      new Set(features.map((feature) => feature.featureName))
    ).map((name) => ({ name }));
    setCommonFeaturesList(commonSet);
  }, [planData]);

  const getAllSelectedPlanIds = (): string[] => {
    return overAllPlans.map((plan) => plan.planId ?? "");
  };

  return {
    isClusterLoading,
    clusterData,
    onAccordionClick,
    getAllSelectedPlanIds,
    handleCustomPlanChange,
    isPlanFetching,
    onSelectPlan,
    commonFeaturesList,
    focused,
    isTagsLoading,
    renderSelectedPlan,
    passSelectPlansPerTag,
    passCorrectBillCyclePerTag,
    handleClusterChange,
    handleBillingChange,
    setFocused,
    tagsData,
    planData,
    expandedId,
    billingData,
    overAllBillingCycle,
  };
};
