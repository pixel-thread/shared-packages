import type { MiddlewareFn } from './chain';

export const withTraceId: MiddlewareFn = async (req, next, _event) => {
  const traceId = req.headers.get('x-trace-id') ?? crypto.randomUUID();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-trace-id', traceId);

  const proxiedReq = new Proxy(req, {
    get(target, prop, receiver) {
      if (prop === 'headers') return requestHeaders;
      return Reflect.get(target, prop, receiver);
    },
  });

  const response = await next(proxiedReq);

  response.headers.set('x-trace-id', traceId);
  return response;
};
