import { Handlers } from "denoland/fresh/server.ts";
import { DbDex } from "utils/types.ts";
import { Pokedex } from "../islands/Pokedex.tsx";

export const handler: Handlers<PreloadData> = {
  GET(_req, ctx) {
    return ctx.render({
      dex: JSON.parse(Deno.readTextFileSync("db/dex.json")),
      saveData: JSON.parse(Deno.readTextFileSync("db/save.json")),
    });
  },
};

interface PreloadData {
  dex: DbDex;
  saveData: number[][];
}

export default function ({ data }: { data: PreloadData }) {
  return <Pokedex dex={data.dex} saveData={data.saveData} />;
}
