export interface Person {
  name: string;
  salary: string;
}

export const sortKeys = ["NAME", "SALARY"] as const;
export type SortKey = (typeof sortKeys)[number];
export interface QueryParams {
  min?: number;
  max?: number;
  offset?: number;
  limit?: number;
  sort?: SortKey;
}
