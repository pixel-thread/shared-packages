import { NextRequest, NextResponse } from "next/server";

interface ErrorShape {
  code: string;
  message: string;
  details?: unknown;
  statusCode: number;
}

function isErrorShape(error: unknown): error is ErrorShape {
  if (typeof error !== "object" || error === null) return false;
  const maybe = error as Record<string, unknown>;
  return (
    typeof maybe.statusCode === "number" &&
    typeof maybe.code === "string" &&
    typeof maybe.message === "string"
  );
}

type RouteHandler<T> = (
  request: NextRequest,
  context: T,
) => Promise<Response>;

export function handleApiErrors<T>(handler: RouteHandler<T>) {
  return async (request: NextRequest, context: T): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (isErrorShape(error)) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
            success: false,
          },
          { status: error.statusCode },
        );
      }

      console.error("Unhandled error:", error);
      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
          },
          success: false,
        },
        { status: 500 },
      );
    }
  };
}
