import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlanSelectedType, TenantCreationStepType } from "../addTenantsUtils";
import { PlanType } from "redux/app/types";

export const useAddTenantState = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<TenantCreationStepType>(0);
  const [nextButtonState, setNextButtonState] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [cluster, setCluster] = useState("");
  const [overAllPlans, setOverAllPlans] = useState<PlanSelectedType[]>([]);
  const [customSelectedPlan, setCustomSelectedPlan] = useState<PlanType>();

  const handleNext = useCallback(
    () =>
      setActiveStep(
        (current) => Math.min(current + 1, 2) as TenantCreationStepType
      ),
    []
  );

  const handleBack = useCallback(
    () =>
      setActiveStep((current) => {
        if (current === 1) {
          setNextButtonState(false);
        }
        if (current === 2 && overAllPlans.length) {
          setNextButtonState(false);
        }
        return Math.max(0, current - 1) as TenantCreationStepType;
      }),
    [overAllPlans.length]
  );

  const handleNextButton = useCallback((state: boolean) => {
    setNextButtonState(state);
  }, []);

  const onNavigateToTenant = () => {
    setActiveStep(0);
    setFiles([]);
    setCluster("");
    setOverAllPlans([]);
    setCustomSelectedPlan(undefined);
    setIsDialogOpen(false);
    navigate("/tenants/create-tenant");
  };

  return {
    activeStep,
    handleNext,
    handleBack,
    handleNextButton,
    files,
    cluster,
    overAllPlans,
    customSelectedPlan,
    isDialogOpen,
    setFiles,
    setCluster,
    setOverAllPlans,
    setCustomSelectedPlan,
    setIsDialogOpen,
    onNavigateToTenant,
    nextButtonState,
    setActiveStep,
  };
};
