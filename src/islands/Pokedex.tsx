import { dexIndex, saveData } from "utils/signals.ts";
import { DbDex } from "utils/types.ts";
import { PokemonList } from "./PokemonList.tsx";
import { TaskList } from "./TaskList.tsx";

interface DexProps {
  dex: DbDex;
  saveData: number[][];
}

export function Pokedex(props: DexProps) {
  saveData.value = props.saveData;
  return (
    <div id="main">
      <TaskList dexEntry={props.dex[dexIndex.value]} />
      <PokemonList dex={props.dex} />
    </div>
  );
}
