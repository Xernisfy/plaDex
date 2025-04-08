import dex from "./../db/dex.json" with { type: "json" };

const oldSave = JSON.parse(Deno.readTextFileSync("db/save_old.json")) as Record<string, (0 | 1)[][]>;
const newSave: number[][] = [];

for (const i in oldSave) {
  const dexIndex = parseInt(i) - 1;
  newSave[dexIndex] = [];
  for (const j in oldSave[i]) {
    const taskIndex = parseInt(j);
    for (const k in oldSave[i][j]) {
      const stepIndex = parseInt(k);
      const stepValue = dex[dexIndex].tasks[taskIndex].steps[stepIndex];
      if (oldSave[i][j][k] === 1) newSave[dexIndex][taskIndex] = stepValue;
    }
  }
}

Deno.writeTextFileSync("db/save.json", JSON.stringify(newSave));
