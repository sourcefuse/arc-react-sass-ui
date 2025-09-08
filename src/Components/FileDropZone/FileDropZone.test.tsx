import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FileDropZone from "./FileDropZone";
const fileDropZoneId = "file-drop-zone-input";
const createDummyFile = (name: string) => {
  const pdfContent = new Blob(["PDF content"], { type: "application/pdf" });
  return new File([pdfContent], `${name}.pdf`, { type: "application/pdf" });
};

describe("FileDropZone", () => {
  const onDrop = vi.fn();
  it("should render File Drop Zone", () => {
    render(<FileDropZone onDrop={onDrop} files={[]} />);
    const dropZone = screen.getByTestId("file-drop-zone");
    expect(dropZone).toBeInTheDocument();
  });

  it("should render Drag & drop files here", () => {
    render(<FileDropZone onDrop={onDrop} files={[]} />);
    const dropZone = screen.getByText("Drag & drop files here");
    expect(dropZone).toBeInTheDocument();
  });

  it("should open file explorer when clicked", () => {
    // Mocking the input click that opens the file explorer
    render(<FileDropZone onDrop={onDrop} files={[]} />);

    const fileInput = screen.getByTestId(fileDropZoneId);
    const uploadButton = screen.getByTestId("file-drop-zone");
    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.click(uploadButton);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("should call onDrop when a file is dropped", async () => {
    const handleDrop = vi.fn();
    const file = createDummyFile("test");

    render(<FileDropZone onDrop={handleDrop} files={[]} />);
    const dropZone = screen.getByTestId(fileDropZoneId);

    const data = {
      dataTransfer: {
        files: [file],
        items: [
          {
            kind: "file",
            getAsFile: () => file,
          },
        ],
        types: ["Files"],
      },
    };

    fireEvent.drop(dropZone, data);
    await waitFor(() => expect(handleDrop).toHaveBeenCalled());
  });
  it("should not allow more than maxFiles and show an error", async () => {
    const maxFiles = 2; // Max files allowed
    const handleDrop = vi.fn();
    const file1 = createDummyFile("file1");
    const file2 = createDummyFile("file2");
    const file3 = createDummyFile("file3");
    render(
      <FileDropZone
        onDrop={handleDrop}
        dropzoneProps={{ maxFiles }}
        files={[]}
      />
    );
    const dropZone = screen.getByTestId(fileDropZoneId);
    const data = {
      dataTransfer: {
        files: [file1, file2, file3], // Trying to upload 3 files when maxFiles = 2
        items: [
          { kind: "file", getAsFile: () => file1 },
          { kind: "file", getAsFile: () => file2 },
          { kind: "file", getAsFile: () => file3 },
        ],
        types: ["Files"],
      },
    };
    fireEvent.drop(dropZone, data);
    await screen.findByText(
      /File limit exceeded only 2 files can be uploaded at once/i
    );
  });
});
