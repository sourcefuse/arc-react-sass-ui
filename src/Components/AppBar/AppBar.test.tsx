import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AppBar from "./AppBar"; // Adjust the path as necessary
import AppWrapper from "AppWrapper";

describe("AppBar", () => {
  it("renders the AppBar component with the user name and logo", () => {
    render(
      <AppWrapper>
        <AppBar
          open={false}
          toggleDrawer={vi.fn()}
          isPermanent={false}
          userName="John Doe"
        />
      </AppWrapper>
    );

    // Check if the AppBar renders and contains the user's name
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByAltText("logo")).toBeInTheDocument(); // Check logo image
  });

  it("menu button opens the menu when clicked", async () => {
    render(
      <AppWrapper>
        <AppBar
          open={false}
          toggleDrawer={vi.fn()}
          isPermanent={false}
          userName="John Doe"
        />
      </AppWrapper>
    );

    const profileBtnTestId = "profile-menu-btn";
    const menuButton = screen.getByRole("button", { name: /john doe/i });

    // Check that the menu is initially closed
    expect(screen.queryByTestId(profileBtnTestId)).not.toBeInTheDocument();

    // Click the button to open the menu
    fireEvent.click(menuButton);
    expect(screen.getByTestId(profileBtnTestId)).toBeInTheDocument();
  });
});
