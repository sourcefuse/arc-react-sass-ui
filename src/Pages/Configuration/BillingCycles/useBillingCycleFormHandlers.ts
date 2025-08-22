import { useFormikContext, FormikValues } from "formik";
import { BillingCycle } from "redux/app/types/subscription";
import { initialValues } from "./billingCycles.utils";
import { AutocompleteChangeReason } from "@mui/material/Autocomplete";

type BillingCycleSelectOption =
  | string
  | {
      label?: string;
      value?: string;
      inputValue?: string;
    };

export function useBillingCycleFormHandlers(
  billingCycleData: BillingCycle[] | undefined
) {
  const { setFieldValue, resetForm, setTouched, validateForm } =
    useFormikContext<FormikValues>();

  const clearForm = () => {
    resetForm({ values: initialValues });
  };

  const isFreeTextEntry = (
    val: BillingCycleSelectOption
  ): val is string | { inputValue: string } =>
    typeof val === "string" || (typeof val === "object" && !!val?.inputValue);

  const handleTextInput = async (val: string | { inputValue: string }) => {
    const newVal = typeof val === "string" ? val : val.inputValue ?? "";
    await setFieldValue("cycleName", newVal, false);
  };

  const populateFieldsFromSelectedCycle = async (cycle: BillingCycle) => {
    await Promise.all([
      setFieldValue("id", cycle.id, false),
      setFieldValue("duration", cycle.duration, false),
      setFieldValue("durationUnit", cycle.durationUnit, false),
      setFieldValue("description", cycle.description ?? "", false),
    ]);

    await validateForm();
    setTouched(
      {
        cycleName: true,
        duration: true,
        durationUnit: true,
        description: true,
      },
      true
    );
  };

  const handleBillingCycleSelection = async (id: string) => {
    const selectedCycle = billingCycleData?.find((bc) => bc.id === id);
    if (selectedCycle) {
      await populateFieldsFromSelectedCycle(selectedCycle);
    }
  };

  const handleBillingCycleChange = async (
    _event: React.SyntheticEvent,
    newValue: BillingCycleSelectOption | null,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "clear") {
      clearForm();
      return;
    }

    if (!newValue) return;

    if (isFreeTextEntry(newValue)) {
      await handleTextInput(newValue);
      return;
    }

    if (newValue.label) {
      await setFieldValue("cycleName", newValue.label, false);
    }

    if (newValue.value) {
      await handleBillingCycleSelection(newValue.value);
    }
  };

  return {
    handleBillingCycleChange,
  };
}
