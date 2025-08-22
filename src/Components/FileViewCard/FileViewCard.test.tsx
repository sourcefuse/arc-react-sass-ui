import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FileViewCard from "./FileViewCard";
import { renderWithStore } from "Tests/utils/renderWithStore";
import * as permissionHook from "Hooks/usePermission";

const FILE_REMOVE_BTN = "file-remove-btn";
describe("FileViewCard", () => {
  const fileDetail: File = {
    name: "test_filename",
    lastModified: 0,
    webkitRelativePath: "",
    size: 0,
    type: "",
  } as File;
  vi.spyOn(permissionHook, "usePermission").mockReturnValue(true);

  const handleFileRemove = vi.fn();

  it("renders the component", () => {
    renderWithStore(<FileViewCard fileDetail={fileDetail} />);
    const element = screen.getByTestId("file-view-card");
    expect(element).toBeInTheDocument();
  });

  it("renders filename that passed", () => {
    renderWithStore(<FileViewCard fileDetail={fileDetail} />);
    const element = screen.getByText("test_filename");
    expect(element).toBeInTheDocument();
  });

  it("renders filesize in MB", () => {
    renderWithStore(
      <FileViewCard fileDetail={{ ...fileDetail, size: 1048576 }} />
    );
    const element = screen.getByText("1.00 MB");
    expect(element).toBeInTheDocument();
  });

  it("renders filesize in KB", () => {
    renderWithStore(
      <FileViewCard fileDetail={{ ...fileDetail, size: 1024 }} />
    );
    const element = screen.getByText("1.00 KB");
    expect(element).toBeInTheDocument();
  });

  it("renders filesize in Bytes", () => {
    renderWithStore(<FileViewCard fileDetail={{ ...fileDetail }} />);
    const element = screen.getByText("0 B");
    expect(element).toBeInTheDocument();
  });

  it("renders remove file button when function is passed", () => {
    renderWithStore(
      <FileViewCard
        fileDetail={fileDetail}
        handleRemoveFile={handleFileRemove}
      />
    );
    const element = screen.getByTestId(FILE_REMOVE_BTN);
    expect(element).toBeInTheDocument();
  });

  it("do not renders remove file button when function is not passed", () => {
    renderWithStore(<FileViewCard fileDetail={fileDetail} />);
    const element = screen.queryByTestId(FILE_REMOVE_BTN);
    expect(element).not.toBeInTheDocument();
  });

  it("fires handleRemoveFile function when remove button is clicked", () => {
    renderWithStore(
      <FileViewCard
        fileDetail={fileDetail}
        handleRemoveFile={handleFileRemove}
      />
    );
    const element = screen.getByTestId(FILE_REMOVE_BTN);
    fireEvent.click(element);
    expect(handleFileRemove).toHaveBeenCalledTimes(1);
  });

  it("do not fires handleRemoveFile function when handleRemove is not passed", () => {
    const handleFileRemoveNotPassed = vi.fn();
    renderWithStore(<FileViewCard fileDetail={fileDetail} />);
    const element = screen.queryByTestId(FILE_REMOVE_BTN);
    if (element) fireEvent.click(element);
    expect(handleFileRemoveNotPassed).not.toHaveBeenCalledTimes(1);
  });
});
