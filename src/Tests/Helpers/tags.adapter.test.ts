import { describe, it, expect } from "vitest";
import { adaptToTagSelect } from "../../Helpers/adapter/tags.adapter";
import { TagType, TagSelectBoxType } from "redux/app/types";

describe("adaptToTagSelect", () => {
  it("should adapt an array of TagType to TagSelectBoxType", () => {
    const tags: TagType[] = [
      {
        id: "1",
        name: "Tag1",
        deleted: false,
        deletedOn: "",
        deletedBy: "",
        createdOn: "",
        modifiedOn: "",
        createdBy: "",
        modifiedBy: "",
      },
      {
        id: "2",
        name: "Tag2",
        deleted: false,
        deletedOn: "",
        deletedBy: "",
        createdOn: "",
        modifiedOn: "",
        createdBy: "",
        modifiedBy: "",
      },
    ];

    const expected: TagSelectBoxType[] = [
      { label: "Tag1", value: "1" },
      { label: "Tag2", value: "2" },
    ];

    const result = adaptToTagSelect(tags);
    expect(result).toEqual(expected);
  });

  it("should return an empty array when input is an empty array", () => {
    const tags: TagType[] = [];
    const expected: TagSelectBoxType[] = [];

    const result = adaptToTagSelect(tags);
    expect(result).toEqual(expected);
  });

  it("should handle undefined or null input", () => {
    const result = adaptToTagSelect(undefined as unknown as TagType[]);
    expect(result).toEqual([]);

    const resultNull = adaptToTagSelect(null as unknown as TagType[]);
    expect(resultNull).toEqual([]);
  });
});
