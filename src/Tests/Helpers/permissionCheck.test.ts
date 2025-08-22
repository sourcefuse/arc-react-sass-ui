import { PermissionsEnum } from "Constants/enums/permissions";
import { describe, expect, it } from "vitest";
import { hasPermission } from "../../Helpers/permissionCheck";

describe("hasPermission", () => {
  it("returns true when requiredPermission is undefined", () => {
    expect(hasPermission([PermissionsEnum.ViewTenant], undefined)).toBe(true);
  });

  it("returns true when requiredPermission is an empty array", () => {
    expect(hasPermission([PermissionsEnum.ViewTenant], [])).toBe(true);
  });

  it("returns true when user has at least one required permission", () => {
    expect(
      hasPermission([PermissionsEnum.ViewTenant], [PermissionsEnum.ViewTenant])
    ).toBe(true);
  });

  it("returns false when user lacks all required permissions", () => {
    expect(
      hasPermission(
        [PermissionsEnum.ViewTenant],
        [PermissionsEnum.UpdateTenant]
      )
    ).toBe(false);
  });

  it("returns true when user has multiple required permissions", () => {
    expect(
      hasPermission(
        [PermissionsEnum.ViewTenant, PermissionsEnum.UpdateTenant],
        [PermissionsEnum.UpdateTenant]
      )
    ).toBe(true);
  });

  it("returns false when none of the required permissions match", () => {
    expect(
      hasPermission(
        [PermissionsEnum.ViewTenant],
        [PermissionsEnum.UpdateTenant, PermissionsEnum.CreateTenant]
      )
    ).toBe(false);
  });

  it("returns true when user has at least one of multiple required permissions", () => {
    expect(
      hasPermission(
        [PermissionsEnum.ViewTenant],
        [PermissionsEnum.ViewTenant, PermissionsEnum.UpdateTenant]
      )
    ).toBe(true);
  });
});
