import { IS_BROWSER } from "denoland/fresh/src/runtime/utils.ts";
import { taskTypeRegex } from "utils/constants.ts";
import { dexIndex, filterProgress, filterRegion, saveData } from "utils/signals.ts";
import { DbDexEntry } from "utils/types.ts";

interface PokemonProps {
  dexEntry: DbDexEntry;
  dexIndex: number;
}

export function Pokemon(props: PokemonProps) {
  if (filterRegion.value !== "all" && !props.dexEntry.regions.includes(filterRegion.value)) return null;
  let completedTasks = 0;
  let allTasks = 0;
  let activeTaskOpen = false;
  const saveDataValue = saveData.value[props.dexIndex] ?? [];
  props.dexEntry.tasks.forEach((task, taskIndex) => {
    task.steps.forEach((step) => {
      ++allTasks;
      if (saveDataValue[taskIndex] && saveDataValue[taskIndex] >= step) ++completedTasks;
      if (taskTypeRegex.test(task.title) && (!saveDataValue[taskIndex] || saveDataValue[taskIndex] < step)) {
        activeTaskOpen = true;
      }
    });
  });
  if (!filterProgress.value && completedTasks === allTasks) return null;
  const progress = Math.floor(completedTasks / allTasks * 5) - 1;
  return (
    <div
      class={"pokemon" +
        (props.dexIndex === dexIndex.value ? " active" : "") +
        (activeTaskOpen ? " active-task-open" : "")}
      onClick={() => {
        dexIndex.value = props.dexIndex;
      }}
    >
      <div class="sprite-border"></div>
      <img class="sprite" loading="lazy" src={IS_BROWSER ? "/api/sprite?url=" + props.dexEntry.sprite : undefined} />
      <div class="index">#{(props.dexIndex + 1).toString().padStart(3, "0")}</div>
      <div class="name">{props.dexEntry.name}</div>
      <img class="progress-ball" src={progress > -1 ? `/assets/pokeball${progress}.png` : undefined} />
    </div>
  );
}
