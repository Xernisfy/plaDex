import { filterProgress } from "utils/signals.ts";

export function FilterProgress() {
  return (
    <img
      id="filter-progress"
      src={`/assets/pokeball${filterProgress.value ? 4 : 0}.png`}
      onClick={() => {
        filterProgress.value = !filterProgress.value;
      }}
    />
  );
}
