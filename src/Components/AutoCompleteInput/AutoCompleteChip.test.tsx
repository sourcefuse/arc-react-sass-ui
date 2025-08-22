import { render, screen } from "@testing-library/react";
import { AutoCompleteChip } from "./AutoCompleteChip";

describe("AutoCompleteChip", () => {
  it("renders a Chip with the correct label for a new value", () => {
    render(
      <AutoCompleteChip
        option={{ label: "New Value", value: "New Value" }}
        getTagProps={({ index }) => ({
          key: index,
          className: "chip-class",
          disabled: false,
          "data-tag-index": index,
          tabIndex: -1,
          onDelete: () => {},
        })}
        index={0}
      />
    );

    const chip = screen.getByText("New Value");
    expect(chip).toBeInTheDocument();
  });

  it("renders a Chip with the correct label for an existing option", () => {
    render(
      <AutoCompleteChip
        option={{ label: "Existing Option", value: "test" }}
        getTagProps={({ index }) => ({
          key: index,
          className: "chip-class",
          disabled: false,
          "data-tag-index": index,
          tabIndex: -1,
          onDelete: () => {},
        })}
        index={0}
      />
    );

    const chip = screen.getByText("Existing Option");
    expect(chip).toBeInTheDocument();
  });
});
