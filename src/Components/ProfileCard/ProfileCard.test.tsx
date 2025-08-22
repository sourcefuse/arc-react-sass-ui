import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { User } from "../../redux/auth/user.model";
import ProfileCard from "./ProfileCard";

describe("ProfileCard Component", () => {
  let mockHandleClose = vi.fn(); // Mock function for handleClose

  // Clear the mock function before each test
  beforeEach(() => {
    mockHandleClose = vi.fn();
  });

  it("renders the card title and user name correctly", () => {
    render(
      <ProfileCard
        cardTitle="Test Title"
        userName="Test User"
        handleClose={mockHandleClose}
      />
    );

    // Check if the card title and user name are rendered
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("uses default values when cardTitle and userName are not provided", () => {
    render(<ProfileCard handleClose={mockHandleClose} />);

    // Check if the default card title and user name are rendered
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
  });

  it("renders the PhoneOutlinedIcon, and EmailOutlinedIcon correctly", () => {
    render(<ProfileCard handleClose={mockHandleClose} />);

    // Check if the icons are rendered
    expect(screen.getByTestId("PhoneOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("EmailOutlinedIcon")).toBeInTheDocument();
  });

  it("calls handleClose when the CloseButton is clicked", () => {
    render(<ProfileCard handleClose={mockHandleClose} />);

    // Simulate clicking the CloseButton
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Check if handleClose was called
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("calls handleClose when the Close Button is clicked", () => {
    render(<ProfileCard handleClose={mockHandleClose} />);

    // Simulate clicking the Close Button
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Check if handleClose was called
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("renders the correct structure", () => {
    render(
      <ProfileCard
        cardTitle="My Profile"
        userName="admin"
        userDetails={{ phone: "9567221088", email: "admin_1@abc.com" } as User}
        handleClose={mockHandleClose}
      />
    );

    // Check if the structure is correct
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("Role: Administrator")).toBeInTheDocument();
    expect(screen.getByText("Mobile number")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("9567221088")).toBeInTheDocument();
    expect(screen.getByText("admin_1@abc.com")).toBeInTheDocument();
  });
});
