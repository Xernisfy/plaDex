import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { cacheFile, readCachedFile } from "utils/cache.ts";
import { fmt } from "utils/deno.ts";
import { DbDex } from "utils/types.ts";

const dexUrl = "https://www.bisafans.de/spiele/editionen/legenden-arceus/hisui-dex.php";
const domParser = new DOMParser();
const textDecoder = new TextDecoder();
// deno-fmt-ignore
const regions: [string, (number | number[])[]][] = [
  ["og", [[9, 82], [85, 87], [126, 128], [153, 155], 225, 232]],
  ["rs", [[9, 10], [33, 35], [38, 39], [42, 47], [52, 56], [65, 70], [88, 131], [135, 137], [139, 140], 226, 233]],
  ["kk", [[9, 13], [17, 21], [24, 32], [36, 37], [40, 49], [52, 56], [67, 70], [77, 87], [94, 95], [98, 99], [126, 128], [139, 140], [142, 175], 227, 231]],
  ["kh", [[14, 16], [33, 35], [42, 49], [52, 53], [65, 68], [71, 74], [79, 80], [88, 91], [96, 99], [104, 107], [109, 123], [135, 137], [153, 155], [165, 166], [176, 203], 229]],
  ["wf", [[9, 10], [24, 37], [42, 51], [57, 59], [63, 64], [77, 78], [85, 87], [100, 103], [124, 125], [135, 137], [151, 155], [157, 159], [165, 166], [179, 188], [194, 197], [201, 206], [211, 224], 228, 230]],
  ["rz", [[0, 8], [132, 134], [207, 210]]],
];
// deno-fmt-ignore
const hisuiForms = ["058", "059", "100", "101", "157", "211", "503", "549", "570", "571", "628", "705", "706", "713", "724"];

function parseHtml(source: Uint8Array) {
  return domParser.parseFromString(textDecoder.decode(source), "text/html");
}

export async function updatePokedex() {
  const dexDoc = parseHtml(await readCachedFile(dexUrl));
  const dex: DbDex = [];
  for (const entry of dexDoc.querySelectorAll("table > tbody > tr")) {
    console.log(dex.length + "/241 (" + Math.floor(dex.length / 241 * 100) + "%)");
    const pokemonLink = entry.children[1].children[1];
    const dexPageUrl = pokemonLink.getAttribute("href");
    if (!dexPageUrl) continue;
    const nationalDex = dexPageUrl?.match(/\d+/)?.[0]!;
    const spriteForm = hisuiForms.includes(nationalDex) ? "a" : nationalDex === "550" ? "b" : "";
    const sprite =
      `https://www.pokewiki.de/Spezial:Filepath/Datei:Pok%C3%A9monsprite_${nationalDex}${spriteForm}_Gesicht_PLA.png`;
    await cacheFile(sprite);
    const dexPageDoc = parseHtml(await readCachedFile(dexPageUrl));
    let tasks: { title: string; steps: number[] }[] = [];
    for (const task of dexPageDoc.querySelectorAll("h3 + p + div > table > tbody > tr")) {
      const [titleCell, ...stepCells] = task.children;
      tasks.push({
        title: titleCell.textContent.trim(),
        steps: stepCells.map((s) => parseInt(s.textContent) || 0).filter(Boolean),
      });
    }
    // deno-fmt-ignore
    switch (dex.length) {
      case 20: tasks[6].steps = [1]; break;
      case 76: tasks[7].steps = [1]; break;
      case 79: tasks[3].steps[4] = 100; break;
      case 87: tasks[7].steps = [1]; break;
      case 165: tasks = [{ "title": "Exemplare gefangen", "steps": [1, 2, 4, 10, 15] }, { "title": "Große Exemplare gefangen", "steps": [1, 2, 3, 5, 7] }, { "title": "Einsatz von Wellentackle gesehen", "steps": [1, 3, 8, 20, 40] }, { "title": "Einsatz von Risikotackle gesehen", "steps": [1, 3, 8, 20, 40] }, { "title": "Exemplare, die sich entwickelt haben", "steps": [1] }]; break;
      case 166: tasks = [{ "title": "Exemplare gefangen", "steps": [1, 2, 3, 4, 5] }, { "title": "Einsatz von Wellentackle gesehen", "steps": [1, 3, 8, 20, 40] }, { "title": "Einsatz von Spukball gesehen", "steps": [1, 3, 6, 12, 25] }, { "title": "Krafttechnik gesehen", "steps": [1, 3, 8, 20, 40] }, { "title": "Tempotechnik gesehen", "steps": [1, 3, 8, 20, 40] }]; break;
      case 195: tasks[7].steps = [1]; break;
      case 237: tasks = [{ "title": "Einen Teil von Arceus anvertraut bekommen", "steps": [1] }]; break;
      case 238: tasks = [{ "title": "Exemplare gefangen", "steps": [1] }, { "title": "Einsatz von Aquawelle gesehen", "steps": [1, 3, 6, 12, 25] }, { "title": "Einsatz von Zen-Kopfstoß gesehen", "steps": [1, 3, 6, 12, 25] }, { "title": "Krafttechnik gesehen", "steps": [1, 3, 6, 12, 25] }]; break;
      case 239: tasks = [{ "title": "Exemplare gefangen", "steps": [1] }, { "title": "Einsatz von Mondgewalt gesehen", "steps": [1, 3, 6, 12, 25] }, { "title": "Einsatz von Mutschub gesehen", "steps": [1, 3, 6, 12, 25] }, { "title": "Krafttechnik gesehen", "steps": [1, 3, 6, 12, 25] }, { "title": "Tempotechnik gesehen", "steps": [1, 3, 8, 20, 40] }]; break;
    }
    let moves: Record<string, number> | undefined;
    for (const task of tasks) {
      if (!task.title.startsWith("Einsatz von ")) continue;
      const move = task.title.split(" ")[2];
      if (!moves) {
        const moveTable =
          dexPageDoc.querySelector('.movetable th a[title="Pokémon-Legenden: Arceus"]')?.parentElement?.parentElement
            ?.parentElement?.parentElement ||
          dexPageDoc.querySelector("#movetable-hisui-gen-8 table") ||
          dexPageDoc.querySelector("#movetable-0-gen-8 table")!;
        moves = {};
        for (const tr of moveTable.querySelectorAll("tbody tr")) {
          moves[tr.children[1].children[0].textContent] = parseInt(tr.children[0].textContent) || 0;
        }
      }
      task.title += ` (Level ${moves[move]})`;
    }
    let text = dexPageDoc.querySelector('li a[title="Pokémon-Legenden: Arceus"]')?.parentElement?.childNodes[1]
      .textContent.trim()!;
    if (dex.length === 166) {
      text =
        "Es hüllt sich in die Seelen von Artgenossen, die auf der Reise stromaufwärts ihr Leben ließen. In den Flüssen Hisuis findet sich kein Lebewesen, welches ihm das Wasser reichen könnte.";
    }
    dex.push({
      name: pokemonLink.textContent,
      nationalDex,
      regions: [],
      sprite,
      tasks,
      text,
    });
  }
  for (const [region, indexes] of regions) {
    for (const idx of indexes) {
      const [f, t] = Array.isArray(idx) ? idx : [idx, idx];
      for (let i = f; i <= t; ++i) {
        dex[i].regions.push(region);
      }
    }
  }
  for (const entry of dex) {
    if (!entry.regions.length) entry.regions.push("??");
  }
  await fmt("json", new TextEncoder().encode(JSON.stringify(dex))).pipeTo(
    Deno.openSync("db/dex.json", { create: true, truncate: true, write: true }).writable,
  );
}
