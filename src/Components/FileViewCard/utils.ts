const MBtoBytes = 1048576;
const KBtoBytes = 1024;

export const getFileSize = (size: number) => {
  if (size >= MBtoBytes) {
    return `${(size / MBtoBytes).toFixed(2)} MB`;
  } else if (size >= KBtoBytes) {
    return `${(size / KBtoBytes).toFixed(2)} KB`;
  }
  return `${size} B`;
};
