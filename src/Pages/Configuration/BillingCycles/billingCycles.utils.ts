import * as Yup from "yup";

export const initialValues = {
  id: "",
  cycleName: "",
  duration: 0,
  durationUnit: "",
  description: "",
};

export const billingCycleValidationSchema = Yup.object().shape({
  cycleName: Yup.string().required("Cycle Name is required"),
  duration: Yup.number()
    .typeError("Enter an integer only")
    .required("Duration is required")
    .positive("Duration must be positive"),
  description: Yup.string().required("Description is required"),
});
