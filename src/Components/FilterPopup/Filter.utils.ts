import {
  subMonths,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { FilterPopupState } from "./FilterPopup";
import { RouteConstant } from "Constants/routeConstant";

export interface FilterOption {
  label: string;
  value: string | string[];
}

export interface FilterCategory {
  label: string;
  options: FilterOption[];
}

export interface FilterConfig {
  [key: string]: FilterCategory; // Allows dynamic filter categories (e.g., status, date)
}

export type Filter = { [key: string]: any };
type FinalFilter = {
  status?: string | null;
  date?: string | { from: string; to: string };
};

export interface IncludeFilter {
  relation: string;
  scope?: {
    where?: Filter;
    fields?: string[];
    limit?: number;
    skip?: number;
    order?: string[];
    include?: IncludeFilter[];
  };
}

export const buildFilters = (
  searchConfig: string[],
  finalFilter: FilterPopupState | null = null,
  searchFilter: string | null = null
): Filter[] => {
  return [
    ...buildStatusFilter(finalFilter ?? {}),
    ...buildDateFilter(finalFilter ?? {}),
    ...buildSearchFilter(searchFilter ?? "", searchConfig),
  ];
};

export const buildStatusFilter = (
  finalFilter: FinalFilter,
  statusColumn?: string
): Filter[] => {
  statusColumn = statusColumn ?? "status";
  if (finalFilter?.status !== null && finalFilter?.status !== undefined) {
    return [
      {
        [statusColumn]: Array.isArray(finalFilter.status)
          ? { inq: finalFilter.status }
          : finalFilter.status,
      },
    ];
  }
  return [];
};

export const buildDateFilter = (
  finalFilter: FinalFilter,
  dateFields?: string[]
): Filter[] => {
  if (!finalFilter?.date) return [];

  const now = new Date();
  let fromDate: Date | null = null;
  let toDate: Date | null = null;

  if (
    typeof finalFilter.date === "object" &&
    finalFilter.date.from &&
    finalFilter.date.to
  ) {
    fromDate = new Date(finalFilter.date.from);
    fromDate.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM (Start of day)

    toDate = new Date(finalFilter.date.to);
    toDate.setUTCHours(23, 59, 59, 999); // Set time to 11:59:59.999 PM (End of day)
  } else if (finalFilter.date === "LastMonth") {
    fromDate = startOfMonth(subMonths(now, 1));
    fromDate.setUTCHours(0, 0, 0, 0);

    toDate = endOfMonth(subMonths(now, 1));
    toDate.setUTCHours(23, 59, 59, 999);
  } else if (finalFilter.date === "LastWeek") {
    fromDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }); // weekStartsOn: 1 -> Monday
    fromDate.setUTCHours(0, 0, 0, 0);

    toDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    toDate.setUTCHours(23, 59, 59, 999);
  }

  if (fromDate && toDate) {
    return dateFields
      ? dateFields.flatMap((field) => [
          { [field]: { gte: fromDate } },
          { [field]: { lte: toDate } },
        ])
      : [{ createdOn: { gte: fromDate } }, { createdOn: { lte: toDate } }];
  }

  return [];
};

type SearchCondition =
  | { [key: string]: { ilike: string } } // Handles individual field conditions
  | { and: { [key: string]: { ilike: string } }[] }; // Handles AND conditions for first & last name

export const buildSearchFilter = (
  searchFilter: string,
  searchFields: string[]
): Filter[] => {
  if (!searchFilter?.trim()) return [];

  const searchValue = `%${searchFilter.trim()}%`;
  const nameParts = searchFilter.trim().split(" ");

  // Construct the OR conditions dynamically based on the provided searchFields
  const orConditions: SearchCondition[] = searchFields.map((field) => ({
    [field]: { ilike: searchValue },
  }));

  // Handle case when search includes a first name and last name
  if (
    searchFields.includes("firstName") &&
    searchFields.includes("lastName") &&
    nameParts.length > 1
  ) {
    orConditions.push({
      and: [
        { firstName: { ilike: `%${nameParts[0]}%` } },
        { lastName: { ilike: `%${nameParts[1]}%` } },
      ],
    });
  }

  return [
    {
      or: orConditions,
    },
  ];
};

export const buildFilter = (
  finalFilter: FinalFilter,
  searchFilter: string,
  searchFields: string[],
  relationField?: { relation: string; field: string },
  dateFields?: string[],
  ignoreIncludeWhere?: boolean,
  statusColumn?: string
) => {
  const filters = [
    ...buildStatusFilter(finalFilter ?? {}, statusColumn),
    ...buildDateFilter(finalFilter ?? {}, dateFields),
    ...buildSearchFilter(searchFilter ?? "", searchFields),
  ];

  if (relationField?.relation) {
    const scopeWhere =
      searchFilter && !ignoreIncludeWhere
        ? { [relationField.field]: { like: `%${searchFilter}%` } }
        : undefined;

    return {
      where: { and: filters },
      include: scopeWhere
        ? [
            {
              relation: relationField.relation,
              scope: { where: scopeWhere },
            },
          ]
        : [
            {
              relation: relationField.relation,
            },
          ],
    };
  } else {
    return {
      where: { and: filters },
    };
  }
};

export const pagesWithFutureDate = [RouteConstant.BILLINGS_AND_INVOICES];
