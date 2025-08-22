import { render, screen, within } from "@testing-library/react";
import React, { useState } from "react";
import DatePicker from "./DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function TestComponent() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker id="test" label="test" value={value} onChange={setValue} />
    </LocalizationProvider>
  );
}

describe("DatePicker", () => {
  it("should be rendered", async () => {
    render(<TestComponent />);
    const datePickerFormControl = screen.getByTestId("datePickerFormControl");
    const label = within(datePickerFormControl).getByText(/test/i);
    expect(label).toBeVisible();
    const input = within(datePickerFormControl).getByRole("textbox");
    expect(input).toBeVisible();
  });
});
