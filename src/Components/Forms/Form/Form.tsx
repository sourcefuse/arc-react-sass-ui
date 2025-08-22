import {
  Formik,
  Form as FormikForm,
  FormikHelpers,
  FormikValues,
} from "formik";
import {
  ForwardedRef,
  forwardRef,
  NamedExoticComponent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import * as yup from "yup";

type AnyObject = Record<string, any>; // NOSONAR

interface Props<T> {
  initialValues: T;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void; // NOSONAR
  validationSchema?: ReturnType<typeof yup.object>;
  id?: string;
  enableReinitialize?: boolean;
  children?: ReactNode;
}

const Form = forwardRef(
  <T extends FormikValues>(
    {
      initialValues,
      onSubmit,
      validationSchema,
      children,
      id,
      enableReinitialize = false,
    }: Props<T>,
    ref: ForwardedRef<HTMLFormElement>
  ) => {
    return (
      <Formik
        enableReinitialize={enableReinitialize}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <FormikForm id={id} onSubmit={handleSubmit} ref={ref}>
            {children}
          </FormikForm>
        )}
      </Formik>
    );
  }
) as NamedExoticComponent<Props<FormikValues>> &
  (<T extends FormikValues>(
    props: Props<T> & { ref?: Ref<HTMLFormElement> }
  ) => ReactElement);

Form.displayName = "Form";
export default Form;
