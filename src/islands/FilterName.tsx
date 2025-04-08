import { filterName } from "utils/signals.ts";

export function FilterName() {
  return (
    <tr>
      <th>
        <span>Suche</span>
      </th>
      <td>
        <input
          id="search"
          type="text"
          value={filterName.value}
          onInput={(e) => filterName.value = e.currentTarget.value}
        />
      </td>
    </tr>
  );
}
