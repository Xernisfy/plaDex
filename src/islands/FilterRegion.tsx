import { filterRegion } from "utils/signals.ts";

export const filterRegionValues = [
  ["all", "Hisui-Region"],
  ["og", "Obsidian-Grasland"],
  ["rs", "Rotes Sumpfland"],
  ["kk", "Kobalt-Küstenland"],
  ["kh", "Kraterberg-Hochland"],
  ["wf", "Weißes Frostland"],
  ["rz", "Raum-Zeit Verzerrung"],
  ["??", "???"],
] as const;
export type FilterRegionValue = typeof filterRegionValues[number][0];

export function FilterRegion() {
  return (
    <select
      id="filter-region"
      value={filterRegion.value}
      onInput={(e) => filterRegion.value = e.currentTarget.value as FilterRegionValue}
    >
      {filterRegionValues.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}
