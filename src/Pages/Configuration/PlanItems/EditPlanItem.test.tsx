/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "redux/store";
import EditPlanItem from "./EditPlanItem";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import * as planItemsApiSlice from "redux/app/planItemsApiSlice";
import { featuresApiSlice } from "redux/app/featuresApiSlice";

import * as notistack from "notistack";

const mockPlanItem = {
  id: "123",
  name: "Test Plan",
  description: "Test Description",
  planValue: [{ featureName: "Test" }],
};

describe("EditPlanItem", () => {
  const mockEnqueueSnackbar = vi.fn();
  const mockEditPlanItem = vi.fn().mockReturnValue({ unwrap: () => {} });

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SnackbarProvider>
            <EditPlanItem />
          </SnackbarProvider>
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(planItemsApiSlice, "useUpdatePlanItemMutation").mockReturnValue([
      mockEditPlanItem,
      { isLoading: false, reset: vi.fn() },
    ]);

    vi.spyOn(featuresApiSlice, "useGetFeaturesQuery").mockReturnValue({
      data: [
        { id: "1", name: "Feature 1" },
        { id: "2", name: "Feature 2" },
      ],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    vi.spyOn(planItemsApiSlice, "useGetPlanItemByIdQuery").mockReturnValue({
      data: mockPlanItem,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    vi.spyOn(notistack, "useSnackbar").mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar,
      closeSnackbar: vi.fn(),
    });
  });

  it("loads and displays plan item data", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockPlanItem.name)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(mockPlanItem.description)
      ).toBeInTheDocument();
    });
  });

  it("updates plan item successfully", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Plan")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Plan Item Name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Plan");

    const updateButton = screen.getByRole("button", {
      name: /Submit/i,
      hidden: true,
    });
    await userEvent.click(updateButton);

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      "Plan Item Updated Successfully",
      { variant: "success" }
    );
  });

  it("shows loading state while fetching data", () => {
    vi.spyOn(planItemsApiSlice, "useGetPlanItemByIdQuery").mockReturnValueOnce({
      isLoading: true,
      refetch: vi.fn(),
    });

    renderComponent();
  });
});
