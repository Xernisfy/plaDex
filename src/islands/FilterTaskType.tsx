import { filterTaskType } from "utils/signals.ts";

export const filterTaskTypeValues = [
  ["all", "Alle"],
  ["active", "Aktiv"],
  ["passive", "Passiv"],
] as const;
export type FilterTaskTypeValue = typeof filterTaskTypeValues[number][0];

export const taskTypeRegex = /(Einsatz|technik).*?gesehen/;

export function FilterTaskType() {
  return (
    <tr>
      <th>Aufgaben</th>
      <td>
        <select
          value={filterTaskType.value}
          onInput={(e) => filterTaskType.value = e.currentTarget.value as FilterTaskTypeValue}
        >
          {filterTaskTypeValues.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </td>
    </tr>
  );
}
