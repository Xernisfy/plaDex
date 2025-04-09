import { saveData } from "utils/signals.ts";
import { DbDex } from "utils/types.ts";
import { DexEntry } from "./DexEntry.tsx";
import { FilterName } from "./FilterName.tsx";
import { FilterProgress } from "./FilterProgress.tsx";
import { FilterRegion } from "./FilterRegion.tsx";
import { FilterTaskType } from "./FilterTaskType.tsx";
import { Tasks } from "./Tasks.tsx";

interface DexProps {
  dex: DbDex;
  saveData: number[][];
}

export function Dex(props: DexProps) {
  saveData.value = props.saveData;
  return (
    <div id="main">
      <div id="dex">
        <table id="selection">
          <FilterName />
          <FilterRegion />
          <FilterProgress />
          <FilterTaskType />
        </table>
        <table id="dexTable">
          <tbody>
            {props.dex.map((dexEntry, index) => <DexEntry dexEntry={dexEntry} idx={index} key={index} />)}
          </tbody>
        </table>
      </div>
      <div id="tasks">
        <table>
          <thead>
            <tr>
              <th>Aufgaben</th>
              <td colSpan={5} style={{ width: "50%" }}></td>
            </tr>
          </thead>
          <tbody>
            <Tasks dex={props.dex} />
          </tbody>
          {props.dex.map(({ tasks }, index) => (
            <tbody id={`tasks-${index}`} hidden>
              {tasks.map(({ title, steps }, taskIdx) => {
                return (
                  <tr data-task={taskIdx}>
                    <th>{title}</th> {steps.map((level, levelIdx) => {
                      if (!level) return <td key={levelIdx}></td>;
                      return (
                        <td
                          key={levelIdx}
                          data-level={levelIdx - steps.filter((l) => !l).length}
                        >
                          <span>{level}</span> <input name="task" type="checkbox"></input>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
