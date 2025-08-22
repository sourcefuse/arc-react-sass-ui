export type RecordOptional<T extends string, V> = {
  [key in T]?: V;
};
export type WhereClause<T extends string> = {
  and?: WhereClause<T>[];
  or?: WhereClause<T>[];
  not?: WhereClause<T>;
} & RecordOptional<T, any>;

export type WhereFilterObj<T extends string> =
  | RecordOptional<T, any>
  | WhereClause<T>;

export interface QueryFilterObject<T extends string> {
  where?: WhereFilterObj<T>;
  fields?: RecordOptional<T, boolean>;
  order?: string[];
  limit?: number;
  skip?: number;
  offset?: number;
}

export interface CountResNode {
  count: number;
}

export interface BaseEntity {
  deleted: boolean;
  deletedOn: string | null;
  deletedBy: string | null;
  createdOn: string;
  modifiedOn: string | null;
  createdBy: string;
  modifiedBy: string | null;
  id: string;
}
