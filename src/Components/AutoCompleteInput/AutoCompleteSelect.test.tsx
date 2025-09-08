import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AutoCompleteSelect from "../AutoCompleteInput/AutoCompleteSelect";
import { vi } from "vitest";

const testId = "autocomplete-select";

describe("AutoCompleteSelect Component", () => {
  const mockData = [
    { label: "Option 1", value: "Option 1" },
    { label: "Option 2", value: "Option 2" },
    { label: "Option 3", value: "Option 3" },
  ];

  const mockOnChange = vi.fn();

  it("renders the component with provided data", () => {
    render(
      <AutoCompleteSelect
        data={mockData}
        value={null}
        onChange={mockOnChange}
        label={testId}
      />
    );

    const inputElement = screen.getByTestId(testId);
    expect(inputElement).toBeInTheDocument();
  });

  it("displays options when focused", async () => {
    render(
      <AutoCompleteSelect
        data={mockData}
        value={null}
        onChange={mockOnChange}
        label={testId}
      />
    );

    const inputElement = screen.getByRole("combobox");
    fireEvent.mouseDown(inputElement); // Simulate opening the dropdown

    await waitFor(() => {
      mockData.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  it("calls onChange when a new option is selected", async () => {
    render(
      <AutoCompleteSelect
        data={mockData}
        value={null}
        onChange={mockOnChange}
        label={testId}
      />
    );
    const input = screen.getByRole("combobox");
    fireEvent.mouseDown(input);
    const optionToSelect = await screen.findByText("Option 1");
    fireEvent.click(optionToSelect);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("renders the selected value when provided", async () => {
    render(
      <AutoCompleteSelect
        data={mockData}
        value={mockData[0]?.value ?? null}
        onChange={mockOnChange}
        label={testId}
      />
    );

    const inputElement = screen.getByRole("combobox");
    expect(inputElement).toHaveValue("Option 1");
  });
});
