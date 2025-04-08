import { dexIndex, filterName, filterProgress, filterRegion, saveData } from "utils/signals.ts";
import { DbDexEntry } from "utils/types.ts";

interface DexEntryProps {
  dexEntry: DbDexEntry;
  idx: number;
}

export function DexEntry({ dexEntry: { name, regions, sprite, tasks }, idx }: DexEntryProps) {
  if (filterName.value && !name.toLowerCase().includes(filterName.value.toLowerCase())) return null;
  if (filterRegion.value !== "all" && !regions.includes(filterRegion.value)) return null;
  let isNew = true;
  let isDone = true;
  const progress = tasks.map(({ steps }, taskIndex) => {
    const save = saveData.value.at(idx)?.[taskIndex];
    if (save !== undefined && save > 0) isNew = false;
    const max = steps[steps.length - 1];
    if (save === undefined || save !== max) isDone = false;
    return save === max;
  });
  if (filterProgress.value === "new" && !isNew) return null;
  if (filterProgress.value === "inProgress" && (isNew || isDone)) return null;
  if (filterProgress.value === "perfect" && !isDone) return null;
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
      <td>#{(idx + 1).toString().padStart(3, "0")}</td>
      <td style={{ textAlign: "center" }}>
        <img src={sprite}></img>
      </td>
      <td>{name}</td>
      <td style={{ minWidth: "120px" }}>
        {isNew || isDone ? null : progress.map((p, i) => (
          <img
            key={i}
            src="/assets/check_16px.svg"
            style={{
              filter: p ? "drop-shadow(0px 0px 1px red) saturate(2)" : "drop-shadow(0px 0px 1px black) grayscale(1)",
            }}
          />
        ))}
      </td>
    </tr>
  );
}
