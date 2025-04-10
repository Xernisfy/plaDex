import { STATUS_CODE } from "denoland/fresh/server.ts";

export const handler = {
  GET() {
    return new Response(null, {
      headers: { Location: "/dex" },
      status: STATUS_CODE.MovedPermanently,
    });
  },
};
