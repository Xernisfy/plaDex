// https://www.bisafans.de/pokedex/426.php
// [...document.querySelector('.movetable th a[title="Pokémon-Legenden: Arceus"]').parentElement.parentElement.parentElement.parentElement.querySelectorAll('tbody tr')].map(tr => [parseInt(tr.children[0].textContent), tr.children[1].children[0].textContent])

import { DOMParser } from 'jsr:@b-fuze/deno-dom';
import dex from './dex.json' with { type: 'json' };

const parseHtml =
  ((p) => (source: string) => p.parseFromString.call(p, source, 'text/html'))(
    new DOMParser(),
  );

const moveLevels: Record<string, Record<string, Record<string, number>>> = {};
for (const { index, link, tasks } of dex) {
  let moves;
  for (const taskIdx in tasks) {
    const task = tasks[taskIdx];
    if (!task.title.startsWith('Einsatz von ')) continue;
    if (!moves) {
      const document = parseHtml(await (await fetch(link)).text());
      let moveTable;
      console.log(link);
      const plaTable = document.querySelector(
        '.movetable th a[title="Pokémon-Legenden: Arceus"]',
      )?.parentElement?.parentElement?.parentElement?.parentElement;
      if (plaTable) moveTable = plaTable;
      else {
        const hisuiTable = document.querySelector(
          '#movetable-hisui-gen-8 table',
        );
        if (hisuiTable) moveTable = hisuiTable;
        else {
          const eightGenTable = document.querySelector(
            '#movetable-0-gen-8 table',
          );
          moveTable = eightGenTable!;
        }
      }
      moves = Object.fromEntries(
        [...moveTable.querySelectorAll('tbody tr')].map(
          (tr) => [
            tr.children[1].children[0].textContent,
            parseInt(tr.children[0].textContent) || 0,
          ],
        ),
      );
    }
    const move = task.title.split(' ')[2];
    if (!moveLevels[index]) moveLevels[index] = {};
    if (!moveLevels[index][taskIdx]) moveLevels[index][taskIdx] = {};
    moveLevels[index][taskIdx][move] = moves[move];
  }
}
Deno.writeTextFileSync(
  `${import.meta.dirname}/moveLevels.json`,
  JSON.stringify(moveLevels, null, 2),
);
