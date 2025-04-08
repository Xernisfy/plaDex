import { Handlers } from "denoland/fresh/server.ts";
import { DbDex } from "utils/types.ts";
import { Dex } from "../islands/Dex.tsx";
import dex from "./../../db/dex.json" with { type: "json" };

export const handler: Handlers<PreloadData> = {
  GET(_req, ctx) {
    return ctx.render({ dex, saveData: JSON.parse(Deno.readTextFileSync("db/save.json")) });
  },
};

interface PreloadData {
  dex: DbDex;
  saveData: number[][];
}

export default function ({ data }: { data: PreloadData }) {
  return <Dex dex={data.dex} saveData={data.saveData} />;
}
