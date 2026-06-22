import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "./types";

export const handleAxiosError = <T>(error: unknown): ApiResponse<T> => {
  let errorMessage = "Something went wrong. Please try again.";
  let errorDetails: string | Record<string, unknown> = "";

  if (error instanceof AxiosError) {
    if (error.response) {
      errorMessage =
        (error.response.data as { message?: string })?.message || errorMessage;
      errorDetails =
        (error.response.data as { error?: string | Record<string, unknown> })
          ?.error ||
        error.response.data ||
        "";
    } else if (error.request) {
      errorMessage = "Please check your internet connection.";
    } else {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return {
    success: false,
    message: errorMessage,
    error: errorDetails,
    data: null,
  };
};

export const handleResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>,
): ApiResponse<T> => {
  const {
    status,
    data: { data, message, meta },
  } = response;
  return {
    success: status === 200 || status === 201,
    message,
    data,
    meta,
  };
};
