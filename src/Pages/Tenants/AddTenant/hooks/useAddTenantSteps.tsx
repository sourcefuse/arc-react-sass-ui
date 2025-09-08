import { useMemo } from "react";
import AddTenantDetails from "../AddTenantDetail";
import ChoosePlan from "../PlanSection/ChoosePlan";
import UploadDocuments from "Components/UploadDocument";
import { MAX_FILES, MAX_FILE_SIZE } from "Helpers/utils";
import { PlanSelectedType, TenantCreationStepType } from "../addTenantsUtils";
import { PlanType } from "redux/app/types";

interface UseAddTenantStepsProps {
  handleNextButton: (state: boolean) => void;
  onChangeCluster: (value: string) => void;
  cluster: string;
  overAllPlans: PlanSelectedType[];
  onHandlePlan: (plans: PlanSelectedType[]) => void;
  customSelectedPlan: PlanType | undefined;
  onHandleCustomPlan: (plan: PlanType | undefined) => void;
  files: File[];
  onFileUpload: (files: File[]) => void;
  onRemoveFile: (files: File[]) => void;
}

export const useAddTenantSteps = (props: UseAddTenantStepsProps) => {
  const stepComponents = useMemo<
    Record<TenantCreationStepType, React.ReactNode>
  >(
    () => ({
      0: <AddTenantDetails />,
      1: (
        <ChoosePlan
          handleNextButton={props.handleNextButton}
          onChangeCluster={props.onChangeCluster}
          cluster={props.cluster}
          overAllPlans={props.overAllPlans}
          onHandlePlan={props.onHandlePlan}
          customSelectedPlan={props.customSelectedPlan}
          onHandleCustomPlan={props.onHandleCustomPlan}
        />
      ),
      2: (
        <UploadDocuments
          onUpload={props.onFileUpload}
          onRemoveFile={props.onRemoveFile}
          files={props.files}
          dropzoneProps={{
            maxFiles: MAX_FILES,
            maxSize: MAX_FILE_SIZE,
            multiple: true,
          }}
        />
      ),
    }),
    [props]
  );

  const renderStepContent = (step: TenantCreationStepType) =>
    stepComponents[step] || null;

  return {
    stepComponents,
    renderStepContent,
  };
};
