import { render, screen, fireEvent } from "@testing-library/react";
import AutoCompleteInput, {
  IAutoCompleteOptions,
  IAutoCompleteProps,
} from "./AutoCompleteInput";
import { describe, it, expect, vi } from "vitest";
import { TextField } from "@mui/material";

const NEW_OPTION = "New Option";
describe("AutoCompleteInput Component", () => {
  const mockHandleChangeEvent = vi.fn();

  const defaultProps: IAutoCompleteProps = {
    id: "test-autocomplete",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
    selectedOptions: [],
    handleChangeEvent: mockHandleChangeEvent,
    isError: false,
    errorMessage: "",
    renderInput: (params) => <TextField {...params} />,
  };

  it("renders without crashing", () => {
    render(<AutoCompleteInput {...defaultProps} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays multiple selected options as chips", () => {
    const selectedOptions: IAutoCompleteOptions[] = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    render(
      <AutoCompleteInput {...defaultProps} selectedOptions={selectedOptions} />
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls handleChangeEvent when a new option is selected", () => {
    render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Option 3" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockHandleChangeEvent).toHaveBeenCalled();
  });

  it("displays an error message when isError is true", () => {
    render(
      <AutoCompleteInput
        {...defaultProps}
        isError={true}
        errorMessage="Error occurred"
      />
    );
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("allows free text input and adds it as a new option", () => {
    render(<AutoCompleteInput {...defaultProps} />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: NEW_OPTION } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockHandleChangeEvent).toHaveBeenCalledWith([
      { value: NEW_OPTION, label: NEW_OPTION },
    ]);
  });
});
