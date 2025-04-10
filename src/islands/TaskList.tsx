import { DbDexEntry } from "utils/types.ts";
import { Task } from "./Task.tsx";

interface TaskListProps {
  dexEntry: DbDexEntry;
}

export function TaskList(props: TaskListProps) {
  return (
    <div id="task-list">
      <div id="cover">
        <div class="paper">
          <div id="title">Pokédex-Aufgaben für {props.dexEntry.name}</div>
          <div id="tasks">
            {[...new Array(10)].map((_, taskIndex) => (
              <Task task={props.dexEntry.tasks[taskIndex] ?? { title: "", steps: [] }} taskIndex={taskIndex} />
            ))}
          </div>
        </div>
        <div class="paper">{props.dexEntry.text}</div>
      </div>
    </div>
  );
}
