import { describe, it, expect } from "vitest";
import { customPlanData } from "./mockData";
import { adaptToPlanList } from "Helpers/adapter";

describe("customAdaptPlanList", () => {
  it("should give plans correctly", () => {
    const expected = {
      pricing: [
        {
          name: "Standard",
          amount: "1,000",
          id: "58d22ff5-73b4-1c3b-7455-f83205cc8f2e",
        },
      ],
      features: [
        { name: "CPQ Document", standard: { included: true } },
        { name: "CPQ", standard: { included: true } },
      ],
    };

    const result = adaptToPlanList(customPlanData);
    expect(result).toEqual(expected);
  });

  it("should handle empty plan data", () => {
    const expected = {
      features: [],
      pricing: [],
    };

    const result = adaptToPlanList([]);
    expect(result).toEqual(expected);
  });
});
