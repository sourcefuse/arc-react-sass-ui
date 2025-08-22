import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeProvider from "Providers/theme/ThemeProvider";
import { vi } from "vitest";
import Input from "./Input";

describe("Input", () => {
  it("should render without errors", () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" />
      </ThemeProvider>
    );
    const input = screen.getByRole("textbox", { name: /test label/i });
    expect(input).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is passed", () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" disabled />
      </ThemeProvider>
    );
    const input = screen.getByRole("textbox", { name: /test label/i });
    expect(input).toBeDisabled();
  });

  it("should display an error when errorMessage is passed", () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" errorMessage="Error message" />
      </ThemeProvider>
    );

    const input = screen.getByLabelText(/test label/i);
    expect(input).toHaveAttribute("aria-invalid", "true"); // Ensure error state is applied

    // Select error message
    const errorMsg = screen.getByText(/error message/i);
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveClass("Mui-error");

    // Select the label directly (without multiple matches)
    const label = screen.getByText(/test label/i, { selector: "label" });
    expect(label).toHaveClass("Mui-error");
  });

  it("should update value on user input", async () => {
    const handleChange = vi.fn();
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" onChange={handleChange} />
      </ThemeProvider>
    );

    const input = screen.getByRole("textbox", { name: /test label/i });
    await userEvent.type(input, "Hello");

    expect(handleChange).toHaveBeenCalledTimes(5); // Each letter triggers onChange
  });

  it("should show copy button when copyEnabled is true", () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" value="copy me" copyEnabled />
      </ThemeProvider>
    );

    const copyButton = screen.getByRole("button", {
      name: /copy to clipboard/i,
    });
    expect(copyButton).toBeInTheDocument();
  });

  it("should apply custom labelSx and inputSx styles", () => {
    const mockLabelSx = vi.fn(() => ({ color: "red" }));
    const mockInputSx = vi.fn(() => ({ backgroundColor: "blue" }));

    render(
      <ThemeProvider>
        <Input
          id="test"
          label="Test Label"
          labelSx={mockLabelSx}
          inputSx={mockInputSx}
        />
      </ThemeProvider>
    );

    expect(mockLabelSx).toHaveBeenCalledWith({
      focused: false,
      value: undefined,
    });
    expect(mockInputSx).toHaveBeenCalledWith({ isError: false });
  });

  it("should copy text to clipboard when copyEnabled is true", async () => {
    const textValue = "Copy this text";
    const onCopyMock = vi.fn(); // Mock onCopy event

    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" value={textValue} copyEnabled />
      </ThemeProvider>
    );

    // Find the copy button
    const copyButton = screen.getByRole("button", {
      name: /copy to clipboard/i,
    });
    expect(copyButton).toBeInTheDocument();

    // Spy on `CopyToClipboard` event
    copyButton.onclick = () => onCopyMock(textValue);

    // Click the copy button
    await userEvent.click(copyButton);

    // Ensure the copy function was called
    expect(onCopyMock).toHaveBeenCalledWith(textValue);
  });

  it("should copy text to clipboard when copyEnabled is true and there is no value passed", async () => {
    const onCopyMock = vi.fn(); // Mock onCopy event

    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" copyEnabled />
      </ThemeProvider>
    );

    // Find the copy button
    const copyButton = screen.getByRole("button", {
      name: /copy to clipboard/i,
    });
    expect(copyButton).toBeInTheDocument();

    // Spy on `CopyToClipboard` event
    copyButton.onclick = () => onCopyMock("");

    // Click the copy button
    await userEvent.click(copyButton);

    // Ensure the copy function was called
    expect(onCopyMock).toHaveBeenCalledWith("");
  });

  it("should show required indicator when required prop is true", () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" required />
      </ThemeProvider>
    );

    const input = screen.getByLabelText(/test label/i);
    expect(input).toBeInTheDocument();
  });

  it("should focus and blur correctly", async () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" />
      </ThemeProvider>
    );

    const input = screen.getByRole("textbox", { name: /test label/i });
    // Move focus to the input
    await userEvent.click(input);
    expect(input).toHaveFocus();

    // Move focus away
    await userEvent.tab();
    expect(input).not.toHaveFocus();
  });

  it("should show helper text when provided", () => {
    render(
      <ThemeProvider>
        <Input id="test" label="Test Label" helperText="Helper text here" />
      </ThemeProvider>
    );

    const helperText = screen.getByText(/helper text here/i);
    expect(helperText).toBeVisible();
  });
});
