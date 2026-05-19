export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const ok = <T>(data: T, message = "Success", meta?: Record<string, unknown>): ApiResponse<T> => ({
  success: true,
  message,
  data,
  meta
});
