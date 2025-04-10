import { sortOrder } from "utils/signals.ts";
import { DbDex } from "utils/types.ts";
import { FilterProgress } from "./FilterProgress.tsx";
import { FilterRegion } from "./FilterRegion.tsx";
import { Pokemon } from "./Pokemon.tsx";

interface PokemonListProps {
  dex: DbDex;
}

export function PokemonList(props: PokemonListProps) {
  const entries = props.dex.map((dexEntry, dexIndex) => [dexEntry, dexIndex] as const);
  if (sortOrder.value === "alpha") entries.sort((a, b) => a[0].name > b[0].name ? 1 : -1);
  return (
    <div id="pokemon-list">
      <div id="filters">
        <FilterRegion />
        <FilterProgress />
      </div>
      <div id="list">
        {entries.map(([dexEntry, dexIndex]) => <Pokemon dexEntry={dexEntry} dexIndex={dexIndex} />)}
      </div>
      <div
        id="sort-order"
        onClick={() => {
          sortOrder.value = sortOrder.value === "alpha" ? "dex" : "alpha";
        }}
      >
        {sortOrder.value === "alpha" ? "Nach Alphabet" : "Nach Nummer"}
      </div>
    </div>
  );
}
