/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PrismaFindManyArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean | Record<string, unknown>>;
  orderBy?: Record<string, unknown> | Record<string, unknown>[];
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: string[] | string;
  [key: string]: unknown; // Allow additional properties (any other Prisma findMany arguments)
}

export interface PrismaCountArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean | Record<string, unknown>>;
  orderBy?: Record<string, unknown> | Record<string, unknown>[];
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: string[] | string;
  [key: string]: unknown; // Allow additional properties (any other Prisma findMany arguments)
}

export interface PrismaModelDelegate {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number>;
}

export interface IQueryParams {
  searchTerm?: string; // Partial matching as opposed to exact matching (filtering)
  page?: string; // Pagination
  limit?: string; // Pagination
  sortBy?: string; // Sorting
  sortOrder?: 'asc' | 'desc'; // Sorting
  fields?: string; // Field selection (e.g., "name,email")
  includes?: string; // Include relations (e.g., "user,specialties")
  [key: string]: any; // Allow additional query parameters
}

export interface IQueryConfig {
  searchableFields?: string[]; // Fields that can be searched with searchTerm
  filterableFields?: string[]; // Fields that can be used for filtering (exact match)
}

export interface PrismaStringFilter {
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  mode?: 'insensitive' | 'default';
  equals?: string;
  in?: string[];
  notIn?: string[];
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  not?: PrismaStringFilter | string;
}

export interface PrismaNumberFilter {
  equals?: number;
  in?: number[];
  notIn?: number[];
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  not?: PrismaNumberFilter | number;
}

export interface PrismaWhereConditions {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown; // Allow additional where conditions
}

export interface IQueryResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
