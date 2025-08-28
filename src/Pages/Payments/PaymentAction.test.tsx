import { fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { CellContext } from "@tanstack/react-table";
import { IBillingInvoice } from "redux/app/types/invoice.type";
import { ActionButtonsContainer } from "./PaymentAction";
import { paymentsData } from "./mockData";
import { renderWithStore } from "Tests/utils/renderWithStore";
import * as permissionHook from "Hooks/usePermission";

describe("ActionButtonsContainer", () => {
  vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);

  it("should call handleDownload when the button is clicked", () => {
    const mockInvoice: IBillingInvoice = paymentsData[0];

    const mockRow = {
      row: { original: mockInvoice },
    } as unknown as CellContext<IBillingInvoice, unknown>;

    const mockHandleDownload = vi.fn();

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const screen = renderWithStore(
      <ActionButtonsContainer
        row={mockRow}
        handleDownload={mockHandleDownload}
      />
    );

    const button = screen.getByLabelText("download");

    fireEvent.click(button);

    expect(mockHandleDownload).toHaveBeenCalledTimes(1);
    expect(mockHandleDownload).toHaveBeenCalledWith(mockInvoice);
  });
});
