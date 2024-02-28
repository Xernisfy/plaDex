import { STATUS_CODE } from './deps.ts';

enum Method {
  GET = 'GET',
  //HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  //CONNECT = 'CONNECT',
  //OPTIONS = 'OPTIONS',
  //TRACE = 'TRACE',
  PATCH = 'PATCH',
}

type Action =
  | Response
  | Promise<Response>
  | ((data: {
    request: Request;
    info: Deno.ServeHandlerInfo;
    query: URLPatternResult['pathname']['groups'];
  }) => Response | Promise<Response>);

export class Server {
  private routes: Record<Method, { pattern: URLPattern; action: Action }[]> = {
    DELETE: [],
    GET: [],
    PATCH: [],
    POST: [],
    PUT: [],
  };
  defaultNotFound: Response = new Response(null, { status: STATUS_CODE.NotFound });
  listen(options: Deno.ServeOptions): Deno.HttpServer {
    return Deno.serve(options, this.handler.bind(this));
  }
  private handler(request: Request, info: Deno.ServeHandlerInfo): Response | Promise<Response> {
    if (request.method in Method) {
      for (const { pattern, action } of this.routes[request.method as Method]) {
        if (!pattern.test(request.url)) continue;
        if (typeof action === 'function') {
          const result: URLPatternResult = pattern.exec(request.url)!;
          const query = result.pathname.groups;
          for (const key in query) {
            query[key] = decodeURIComponent(query[key]!);
          }
          return action({ request, info, query: result.pathname.groups });
        } else return action;
      }
    }
    return this.defaultNotFound;
  }
  private registerRoute(method: Method, path: string, action: Action): void {
    this.routes[method].push({ pattern: new URLPattern({ pathname: path }), action });
  }
  get(path: string, action: Action): void {
    this.registerRoute(Method.GET, path, action);
  }
  post(path: string, action: Action): void {
    this.registerRoute(Method.POST, path, action);
  }
  put(path: string, action: Action): void {
    this.registerRoute(Method.PUT, path, action);
  }
  delete(path: string, action: Action): void {
    this.registerRoute(Method.DELETE, path, action);
  }
  patch(path: string, action: Action): void {
    this.registerRoute(Method.PATCH, path, action);
  }
}
