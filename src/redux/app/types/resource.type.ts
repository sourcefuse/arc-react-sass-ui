/**
 * Enum for resource types.
 */
export enum ResourceTypes {
  BUCKET = "bucket",
}
/**
 * Represents the data of a resource.
 */
export type ResourceData = {
  type: ResourceTypes.BUCKET;
  externalIdentifier: string;
  metadata: {
    bucket: string;
    path: string;
  };
};

export type ResourceType<
  T extends ResourceData["metadata"] = ResourceData["metadata"]
> = {
  id: string;
  externalIdentifier: string;
  type: ResourceTypes;
  metadata: T;
  tenantId: string;
};
