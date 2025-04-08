import { filterRegion } from "utils/signals.ts";

export const filterRegionValues = [
  ["all", "Alle"],
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
    <tr>
      <th>
        <span>Region</span>
      </th>
      <td>
        <select
          id="region"
          value={filterRegion.value}
          onInput={(e) => filterRegion.value = e.currentTarget.value as FilterRegionValue}
        >
          {filterRegionValues.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </td>
    </tr>
  );
}
