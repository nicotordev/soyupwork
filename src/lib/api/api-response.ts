import { NextResponse } from "next/server";

export type ApiResponseMeta = {
  status: number;
  ok: boolean;
  message: string;
};

export type ApiResponseBody<T = unknown> = {
  data: T;
  meta: ApiResponseMeta;
};

type ResponseData = Record<string, unknown> | null | undefined;

class ApiResponse {
  private formatBody<T>(
    status: number,
    message: string,
    data?: ResponseData,
  ): ApiResponseBody<T> {
    const payload =
      data && typeof data === "object" && "data" in data
        ? (data.data as T)
        : ((data ?? null) as T);

    return {
      data: payload,
      meta: {
        status,
        ok: status >= 200 && status < 300,
        message,
      },
    };
  }

  private json<T>(
    status: number,
    message: string,
    data?: ResponseData,
    init?: ResponseInit,
  ) {
    return NextResponse.json(this.formatBody<T>(status, message, data), {
      status,
      ...init,
    });
  }

  success<T extends ResponseData = ResponseData>(
    data?: T,
    message = "Success",
    init?: ResponseInit,
  ) {
    return this.json(200, message, data, init);
  }

  created<T extends ResponseData = ResponseData>(
    data?: T,
    message = "Created",
    init?: ResponseInit,
  ) {
    return this.json(201, message, data, init);
  }

  accepted<T extends ResponseData = ResponseData>(
    data?: T,
    message = "Accepted",
    init?: ResponseInit,
  ) {
    return this.json(202, message, data, init);
  }

  noContent(init?: ResponseInit) {
    return new NextResponse(null, { status: 204, ...init });
  }

  badRequest(
    data?: ResponseData,
    message = "Bad request",
    init?: ResponseInit,
  ) {
    return this.json(400, message, data, init);
  }

  unauthorized(
    data?: ResponseData,
    message = "Unauthorized",
    init?: ResponseInit,
  ) {
    return this.json(401, message, data, init);
  }

  forbidden(data?: ResponseData, message = "Forbidden", init?: ResponseInit) {
    return this.json(403, message, data, init);
  }

  notFound(data?: ResponseData, message = "Not found", init?: ResponseInit) {
    return this.json(404, message, data, init);
  }

  methodNotAllowed(
    data?: ResponseData,
    message = "Method not allowed",
    init?: ResponseInit,
  ) {
    return this.json(405, message, data, init);
  }

  conflict(data?: ResponseData, message = "Conflict", init?: ResponseInit) {
    return this.json(409, message, data, init);
  }

  unprocessableEntity(
    data?: ResponseData,
    message = "Unprocessable entity",
    init?: ResponseInit,
  ) {
    return this.json(422, message, data, init);
  }

  tooManyRequests(
    data?: ResponseData,
    message = "Too many requests",
    init?: ResponseInit,
  ) {
    return this.json(429, message, data, init);
  }

  internalServerError(
    data?: ResponseData,
    message = "Internal server error",
    init?: ResponseInit,
  ) {
    return this.json(500, message, data, init);
  }

  error(
    status: number,
    message: string,
    data?: ResponseData,
    init?: ResponseInit,
  ) {
    return this.json(status, message, data, init);
  }
}

export default new ApiResponse();
