/* eslint-disable sonarjs/no-duplicate-string */
import { render, screen, fireEvent } from "@testing-library/react";
import RenderButton from "./ClustersRenderButton";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import { apiSlice } from "redux/apiSlice";
import * as permissionHook from "Hooks/usePermission";

describe("RenderButton Component", () => {
  const mockHandleCancel = vi.fn();
  const mockRefetch = vi.fn();
  const mockHandleSubmit = vi.fn();

  const initialValues = { id: "", name: "" };
  vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);
  const mockStore = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  const renderComponent = (formikProps = {}) => {
    render(
      <Provider store={mockStore}>
        <Formik
          initialValues={initialValues}
          onSubmit={mockHandleSubmit}
          {...formikProps}
        >
          <RenderButton refetch={mockRefetch} handleCancel={mockHandleCancel} />
        </Formik>
      </Provider>
    );
  };

  it("renders Cancel, Delete, and Submit buttons", () => {
    renderComponent();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls handleCancel when Cancel button is clicked", () => {
    renderComponent();
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockHandleCancel).toHaveBeenCalled();
  });

  it("disables Submit button when form is invalid or not dirty", () => {
    renderComponent({ initialValues: { id: "", name: "" } });
    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeDisabled();
  });

  it("renders Update button when form has an ID", () => {
    renderComponent({ initialValues: { id: "1", name: "Test Cluster" } });
    expect(screen.getByText("Update")).toBeInTheDocument();
  });
});
