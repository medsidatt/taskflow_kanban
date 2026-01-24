/**
 * Generic API Response model
 * Matches the backend ApiResponse DTO
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Paginated API Response model
 * Matches the backend PageResponse DTO
 */
export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Error Response model
 * Matches the backend ErrorResponse DTO
 */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: { [key: string]: string };
}
