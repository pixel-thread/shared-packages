/**
 * @file Generic HTTP API error class for Express applications.
 *
 * Provides a standard error shape with an HTTP status code that can be
 * caught by error-handling middleware and serialised in API responses.
 */

/**
 * Generic HTTP API error with a numeric status code.
 *
 * Extends the native `Error` so it integrates with Express error middleware.
 * The `statusCode` property is used by error handlers to set the HTTP status
 * on the response.
 *
 * @example
 * ```ts
 * throw new ApiError(404, "User not found");
 * ```
 */
export class ApiError extends Error {
  /** HTTP status code sent to the client. */
  public readonly statusCode: number;

  /**
   * @param statusCode - HTTP status code (e.g. 400, 404, 500).
   * @param message    - Human-readable error description.
   */
  constructor(statusCode: number, message: string) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
