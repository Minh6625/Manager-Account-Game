/** Standard API success envelope (architecture §7.2) */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/** Standard API error envelope */
export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
