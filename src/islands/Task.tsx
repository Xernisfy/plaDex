import { taskTypeRegex } from "utils/constants.ts";
import { dexIndex, saveData } from "utils/signals.ts";
import { DbTask } from "utils/types.ts";

interface TaskProps {
  task: DbTask;
  taskIndex: number;
}

export function Task(props: TaskProps) {
  const saveDataValue = saveData.value[dexIndex.value]?.[props.taskIndex] || 0;
  const maxValue = props.task.steps[props.task.steps.length - 1];
  return (
    <div class="task">
      <div
        class={"title" +
          (saveDataValue === maxValue ? " line-through" : (taskTypeRegex.test(props.task.title) ? " underline" : ""))}
      >
        {props.task.title}
      </div>
      <div class="value">{props.task.title && saveDataValue}</div>
      <div class="steps">
        {props.task.steps.map((step, stepIndex) => (
          <div
            class={"step" + (saveDataValue >= step ? " completed" : "")}
            onClick={() => {
              fetch("/api/task", {
                body: JSON.stringify({
                  dexIndex: dexIndex.value,
                  taskIndex: props.taskIndex,
                  value: saveDataValue < step ? step : props.task.steps[stepIndex - 1] || 0,
                }),
                method: "PUT",
              }).then((res) => res.json()).then((value) => {
                const oldSaveData = saveData.value;
                oldSaveData[dexIndex.value!] = value;
                saveData.value = [...oldSaveData];
              });
            }}
          >
            <div class="value">{step}</div>
            <div class="check">
              <img src="/assets/check_16px.svg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
