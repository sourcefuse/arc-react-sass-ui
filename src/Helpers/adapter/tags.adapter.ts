import { TagSelectBoxType, TagType } from "redux/app/types";

export function adaptToTagSelect(tags: TagType[]): TagSelectBoxType[] {
  return (
    tags?.map((tag: TagType) => {
      return {
        label: tag.name,
        value: tag.id,
      };
    }) || []
  );
}
