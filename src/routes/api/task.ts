import { Handlers } from "denoland/fresh/server.ts";
import { fmt } from "utils/deno.ts";

const dbFile = "db/save.json";

export const handler: Handlers = {
  async PUT(req) {
    const { dexIndex, taskIndex, value } = await req.json();
    const db = JSON.parse(Deno.readTextFileSync(dbFile)) || [];
    if (!db[dexIndex]) db[dexIndex] = [];
    db[dexIndex][taskIndex] = value;
    fmt("json", new TextEncoder().encode(JSON.stringify(db)))
      .pipeTo(Deno.openSync(dbFile, { create: true, write: true }).writable);
    Deno.writeTextFileSync(dbFile, JSON.stringify(db));
    return new Response(JSON.stringify(db[dexIndex]));
  },
};
