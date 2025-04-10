import { Handlers, STATUS_CODE } from "denoland/fresh/server.ts";
import { readCachedFile } from "utils/cache.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const url = ctx.url.searchParams.get("url");
    if (!url) return new Response(null, { status: STATUS_CODE.BadRequest });
    return new Response(await readCachedFile(url));
  },
};
