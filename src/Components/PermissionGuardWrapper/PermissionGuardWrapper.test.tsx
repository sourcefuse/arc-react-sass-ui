import { screen } from "@testing-library/react";
import { PermissionsEnum } from "Constants/enums/permissions";
import { MemoryRouter } from "react-router-dom";
import { renderWithStore } from "Tests/utils/renderWithStore";
import { describe, it } from "vitest";
import { PermissionGuardWrapper } from "../PermissionGuardWrapper";

describe("PermissionGuardWrapper", () => {
  it("renders children when user has required permissions", () => {
    renderWithStore(
      <MemoryRouter>
        <PermissionGuardWrapper
          requiredPermissions={[PermissionsEnum.ViewTenant]}
        >
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGuardWrapper>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: [PermissionsEnum.ViewTenant] },
        },
      }
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("redirects to /not-authorized when user lacks permissions", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/protected"]}>
        <PermissionGuardWrapper
          requiredPermissions={[PermissionsEnum.UpdateTenant]}
        >
          <div data-testid="protected-content">Protected Content</div>
        </PermissionGuardWrapper>
      </MemoryRouter>,
      {
        preloadedState: {
          auth: { permissions: [PermissionsEnum.ViewTenant] },
        },
      }
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
});
