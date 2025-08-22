export * from "./permissions";

// Enum identifying different API service slices used in the application
export enum ApiSliceIdentifier {
  TENANT_FACADE, // Provides an interface for tenant-related operations
  AUDIT_FACADE, // Provides an interface for audit-related operations
}
