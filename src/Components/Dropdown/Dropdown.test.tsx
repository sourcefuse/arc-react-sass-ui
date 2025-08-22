import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import Dropdown, { AutocompleteValueType, DropdownProps } from "./Dropdown";

const options = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Devops", value: "devops" },
];

const MockDropdown = (
  props: Omit<DropdownProps, "id" | "options"> & {
    initialValue?: AutocompleteValueType;
  }
) => {
  const [value, setValue] = useState(props.initialValue);
  return (
    <Dropdown
      id="test"
      value={value}
      onChange={setValue}
      label="test"
      options={options}
      {...props}
    />
  );
};

describe("Dropdown", () => {
  it("should be rendered", () => {
    render(<MockDropdown />);

    const dropdownFormControl = screen.getByTestId("dropdownFormControl");

    const label = within(dropdownFormControl).getByText(/test/i);
    expect(label).toBeVisible();

    const dropdownIcon =
      within(dropdownFormControl).getByTestId("ArrowDropDownIcon");
    expect(dropdownIcon).toBeVisible();
  });

  it("should not be able to type", () => {
    render(<MockDropdown />);
    const textbox = screen.getByRole("combobox");
    expect(textbox).toHaveAttribute("readonly");
  });

  it("should work with useState", () => {
    render(<MockDropdown />);

    const dropdownIcon = screen.getByTestId("ArrowDropDownIcon");
    fireEvent.click(dropdownIcon);

    const optionOne = screen.getByRole("option", { name: /frontend/i });
    fireEvent.click(optionOne);

    const autocomplete = screen.getByTestId("dropdownAutocomplete");
    const textbox = within(autocomplete).getByRole("combobox");

    expect(textbox).toHaveValue("Frontend");
  });

  it("should be able to select multiple elements when multiple flag is passed", () => {
    render(<MockDropdown multiple initialValue={[]} />);

    const dropdownIcon = screen.getByTestId("ArrowDropDownIcon");
    fireEvent.click(dropdownIcon);

    const optionOne = screen.getByRole("option", { name: /Frontend/i });
    fireEvent.click(optionOne);

    const optionTwo = screen.getByRole("option", { name: /Backend/i });
    fireEvent.click(optionTwo);

    const buttonOne = screen.getByRole("button", { name: /Frontend/i });
    expect(buttonOne).toBeVisible();

    const buttonTwo = screen.getByRole("button", { name: /Backend/i });
    expect(buttonTwo).toBeVisible();
  });
});

describe("AutoComplete", () => {
  it("should be rendered", () => {
    render(<MockDropdown enableAutoComplete />);
    const dropdownFormControl = screen.getByTestId("dropdownFormControl");
    const dropdownIcon =
      within(dropdownFormControl).queryByTestId("ArrowDropDownIcon");
    expect(dropdownIcon).not.toBeInTheDocument();
  });

  it("should be able to type", async () => {
    render(<MockDropdown enableAutoComplete />);
    const textbox = screen.getByRole("combobox");
    await userEvent.type(textbox, "abc");
    expect(textbox).toHaveValue("abc");
  });

  it("should work with useState", () => {
    render(<MockDropdown enableAutoComplete />);

    const textbox = screen.getByRole("combobox", { name: /test/i });
    fireEvent.focus(textbox);
    fireEvent.keyDown(textbox, { key: "ArrowDown" });

    const optionOne = screen.getByRole("option", { name: /frontend/i });
    fireEvent.click(optionOne);

    expect(textbox).toHaveValue("Frontend");
  });

  it("should not be able to select multiple elements when multiple flag is not passed", () => {
    render(<MockDropdown enableAutoComplete />);

    const textbox = screen.getByRole("combobox", { name: /test/i });
    fireEvent.focus(textbox);
    fireEvent.keyDown(textbox, { key: "ArrowDown" });

    // Select the first option
    fireEvent.keyDown(textbox, { key: "ArrowDown" });
    const optionOne = screen.getByRole("option", { name: /frontend/i });
    fireEvent.click(optionOne);

    // Verify the textbox value is updated to the first selection
    expect(textbox).toHaveValue("Frontend");

    // Attempt to select the second option
    fireEvent.focus(textbox);
    fireEvent.keyDown(textbox, { key: "ArrowDown" });
    const optionTwo = screen.getByRole("option", { name: /backend/i });
    fireEvent.click(optionTwo);

    // Verify the textbox value is updated to the second selection, replacing the first
    expect(textbox).toHaveValue("Backend");
  });
});
