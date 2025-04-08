import { dexIndex, saveData } from "utils/signals.ts";
import { DbDex } from "utils/types.ts";

interface TasksProps {
  dex: DbDex;
}

export function Tasks({ dex }: TasksProps) {
  return dex[dexIndex.value].tasks.map(({ title, steps }, taskIndex) => {
    const currentValue = saveData.value[dexIndex.value]?.[taskIndex] || 0;
    return (
      <tr>
        <th>{title}</th>
        {[...new Array(5 - steps.length)].map(() => <td></td>)}
        {steps.map((step, stepIndex) => (
          <td
            onClick={() => {
              fetch("/api/task", {
                body: JSON.stringify({
                  dexIndex: dexIndex.value,
                  taskIndex,
                  value: currentValue < step ? step : steps[stepIndex - 1] || 0,
                }),
                method: "PUT",
              }).then((res) => res.json()).then((value) => {
                const oldSaveData = saveData.value;
                oldSaveData[dexIndex.value!] = value;
                saveData.value = [...oldSaveData];
              });
            }}
          >
            <div>
              {currentValue < step ? <span>{step}</span> : <img src="/assets/check_64px.svg" />}
            </div>
          </td>
        ))}
      </tr>
    );
  });
}
