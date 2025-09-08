type SectionItem = {
  label: string;
  value: string | number;
  color?: string;
  highlight?: boolean;
};
export type Section = {
  title: string;
  data: SectionItem[];
};
