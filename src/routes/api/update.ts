import { Handlers, STATUS_CODE } from "denoland/fresh/server.ts";
import { updatePokedex } from "utils/updatePokedex.ts";

export const handler: Handlers = {
  async GET() {
    await updatePokedex();
    return new Response(null, {
      headers: { Location: "/dex" },
      status: STATUS_CODE.TemporaryRedirect,
    });
  },
};
