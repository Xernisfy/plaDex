import { dexIndex, filterName, filterProgress, filterRegion, filterTaskType, saveData } from "utils/signals.ts";
import { DbDexEntry } from "utils/types.ts";
import { taskTypeRegex } from "./FilterTaskType.tsx";

interface DexEntryProps {
  dexEntry: DbDexEntry;
  idx: number;
}

export function DexEntry({ dexEntry: { name, regions, sprite, tasks }, idx }: DexEntryProps) {
  if (filterName.value && !name.toLowerCase().includes(filterName.value.toLowerCase())) return null;
  if (filterRegion.value !== "all" && !regions.includes(filterRegion.value)) return null;
  let isNew = true;
  let isDone = true;
  let isActive = false;
  let isPassive = false;
  const progress = tasks.map(({ steps, title }, taskIndex) => {
    const save = saveData.value.at(idx)?.[taskIndex];
    if (save !== undefined && save > 0) isNew = false;
    const max = steps[steps.length - 1];
    if (save === undefined || save !== max) isDone = false;
    if (save !== max) {
      if (taskTypeRegex.test(title)) isActive = true;
      else isPassive = true;
    }
    return save === max;
  });
  if (filterProgress.value === "new" && !isNew) return null;
  if (filterProgress.value === "inProgress" && (isNew || isDone)) return null;
  if (filterProgress.value === "perfect" && !isDone) return null;
  if (filterTaskType.value === "active" && !isActive) return null;
  if (filterTaskType.value === "passive" && !isPassive) return null;
  const classes: string[] = [];
  if (dexIndex.value === idx) classes.push("current");
  if (!isNew && !isDone) classes.push("progress-inprogress");
  if (isDone) classes.push("progress-perfect");
  return (
    <tr
      class={classes.join(" ")}
      onClick={() => {
        dexIndex.value = idx;
      }}
    >
      <td class="text-center" style={{ width: "50px" }}>#{(idx + 1).toString().padStart(3, "0")}</td>
      <td class="text-center" style={{ width: "50px" }}>
        <img src={sprite}></img>
      </td>
      <td class="text-left" style={{ width: "150px" }}>{name}</td>
      <td class="text-left" style={{ width: "150px" }}>
        {isNew || isDone ? null : progress.map((p, i) => (
          <img
            key={i}
            src="/assets/check_16px.svg"
            style={{
              filter: p ? "saturate(2)" : "brightness(10)",
            }}
          />
        ))}
      </td>
    </tr>
  );
}
