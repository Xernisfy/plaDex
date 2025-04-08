import { Handlers } from "denoland/fresh/server.ts";

const dbFile = "db/save.json";

export const handler: Handlers = {
  async PUT(req) {
    const { dexIndex, taskIndex, value } = await req.json();
    console.log(dexIndex, taskIndex, value);
    const db = JSON.parse(Deno.readTextFileSync(dbFile)) || [];
    if (!db[dexIndex]) db[dexIndex] = [];
    db[dexIndex][taskIndex] = value;
    Deno.writeTextFileSync(dbFile, JSON.stringify(db, null, 2));
    return new Response(JSON.stringify(db[dexIndex]));
  },
};
