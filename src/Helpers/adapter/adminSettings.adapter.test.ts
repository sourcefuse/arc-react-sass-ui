import { IFormAdminSettings } from "Pages/Configuration/Settings/settings.utils";
import {
  TagSelectBoxType,
  TagType,
  TierSelectBoxType,
  TierType,
} from "redux/app/types";
import {
  AdminSettings,
  CombinedAdminSettings,
} from "redux/app/types/adminSettings.type";
import { adaptToAdminSettings } from "./adminSettings.adapter";

describe("adaptToAdminSettings", () => {
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
  const tiers: TierType[] = [
    {
      id: "1",
      label: "Tier1",
      deleted: false,
      deletedOn: "",
      deletedBy: "",
      createdOn: "",
      modifiedOn: "",
      createdBy: "",
      modifiedBy: "",
      description: "",
    },
    {
      id: "2",
      label: "Tier2",
      deleted: false,
      deletedOn: "",
      deletedBy: "",
      createdOn: "",
      modifiedOn: "",
      createdBy: "",
      modifiedBy: "",
      description: "",
    },
  ];
  const expectedTags: TagSelectBoxType[] = [
    { label: "Tag1", value: "1" },
    { label: "Tag2", value: "2" },
  ];

  const expectedTier: TierSelectBoxType[] = [
    { label: "Tier1", value: "1" },
    { label: "Tier2", value: "2" },
  ];

  const expectedAdminSettings: AdminSettings[] = [
    {
      id: "007be571-0dcf-f8a9-1245-fe73fd5c9fdc",
      observabilityUrl: "https://grafana.sf-sample.com",
      rowsPerListing: 10,
      leadAutoClose: 5,
    },
  ];
  const combinesAdminSettings: CombinedAdminSettings = {
    adminSettings: expectedAdminSettings,
    tags,
    tiers,
  };
  const expected: IFormAdminSettings = {
    ...expectedAdminSettings[0],
    tags: expectedTags,
    tiers: expectedTier,
  };

  it("should adapt an array of CombinedAdminSettings to IFormAdminSettings", () => {
    const result = adaptToAdminSettings(combinesAdminSettings);
    expect(result).toEqual(expected);
  });

  it("should return default values when input is an empty array", () => {
    const combined: CombinedAdminSettings = {
      adminSettings: [],
      tags: [],
      tiers: [],
    };

    const result = adaptToAdminSettings(combined);
    expect(result).toEqual({
      tags: [],
      tiers: [],
    });
  });
});
