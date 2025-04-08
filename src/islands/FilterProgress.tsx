import { filterProgress } from "utils/signals.ts";

export const filterProgressValues = [
  ["all", "Alle"],
  //["pinned", "Angepinnt"],
  ["new", "Neu"],
  ["inProgress", "Angefangen"],
  ["perfect", "Perfekt"],
] as const;
export type FilterProgressValue = typeof filterProgressValues[number][0];

export function FilterProgress() {
  return (
    <tr>
      <th>
        <span>Fortschritt</span>
      </th>
      <td>
        <select
          id="filter"
          value={filterProgress.value}
          onInput={(e) => filterProgress.value = e.currentTarget.value as FilterProgressValue}
        >
          {filterProgressValues.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </td>
    </tr>
  );
}
