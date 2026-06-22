import axios, { AxiosRequestConfig, isCancel } from "axios";
import { logger } from "@items/utils/client-logger";
import { ApiResponse } from "./types";
import { handleResponse, handleAxiosError } from "./response";

export const http = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.get(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      if (isCancel(error)) {
        logger.warn(`GET ${url} Request to ${url} was cancelled.`);
      }
      return handleAxiosError<T>(error);
    }
  },

  post: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.post(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  put: async <T>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.put(url, data, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axios.delete(url, config);
      return handleResponse<T>(response);
    } catch (error) {
      return handleAxiosError<T>(error);
    }
  },
};
