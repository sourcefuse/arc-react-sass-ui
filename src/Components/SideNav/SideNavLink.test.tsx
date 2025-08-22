/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideNavLink from "./SideNavLink";
import { SideNavConfig } from "./sideNavConfig";

interface MockLocation {
  pathname: string;
  state: null;
  key: string;
  search: string;
  hash: string;
}

const mockLocation: MockLocation = {
  pathname: "/test",
  state: null,
  key: "testKey",
  search: "",
  hash: "",
};

const mockSideNavConfig: SideNavConfig = {
  label: "Test Link",
  link: "/test",
  visible: true,
  icon: <div>Icon</div>,
};

describe("SideNavLink", () => {
  it("renders a link with the correct label", () => {
    render(
      <MemoryRouter>
        <SideNavLink {...mockSideNavConfig} location={mockLocation} />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Link")).toBeInTheDocument();
  });

  it("renders the icon if provided", () => {
    render(
      <MemoryRouter>
        <SideNavLink {...mockSideNavConfig} location={mockLocation} />
      </MemoryRouter>
    );

    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("does not render if visible is false", () => {
    const invisibleConfig = { ...mockSideNavConfig, visible: false };
    render(
      <MemoryRouter>
        <SideNavLink {...invisibleConfig} location={mockLocation} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Test Link")).not.toBeInTheDocument();
  });

  it("does not apply active class when the link does not match the current location", () => {
    render(
      <MemoryRouter initialEntries={["/different"]}>
        <SideNavLink {...mockSideNavConfig} location={mockLocation} />
      </MemoryRouter>
    );

    const linkElement = screen.getByText("Test Link").closest("a");
    expect(linkElement).not.toHaveClass("active");
  });

  it("does not render the link if visible is false", () => {
    const hiddenSideNavConfig = { ...mockSideNavConfig, visible: false };

    render(
      <MemoryRouter>
        <SideNavLink {...hiddenSideNavConfig} location={mockLocation} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Test Link")).not.toBeInTheDocument();
  });
});
