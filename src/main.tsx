import {
  DOMParser,
  Element,
  renderToString,
  Server,
  STATUS_CODE,
  VNode,
} from "./deps.ts";

class HTMLResponse extends Response {
  constructor(html: VNode) {
    super(`<!doctype html>${renderToString(html)}`, {
      headers: { "Content-Type": "text/html;charset=utf8" },
    });
  }
}

const dexFilePath = `${import.meta.dirname}/dex.json`;
const saveFilePath = `${import.meta.dirname}/save.json`;
const bisafansBaseUrl = `https://www.bisafans.de`;
const domParser = new DOMParser();

type Task = {
  title: string;
  levels: number[];
};

type DexEntry = {
  index: number;
  name: string;
  sprite: string;
  link: string;
  tasks: Task[];
};

type SaveData = Record<string, (0 | 1)[][]>;

type TaskUpdate = {
  type: "update";
  id: string;
  task: number;
  level: number;
  state: boolean;
};

async function loadDex(): Promise<DexEntry[]> {
  try {
    return JSON.parse(Deno.readTextFileSync(dexFilePath));
  } catch (e) {
    console.warn("dex file not found => generating...");
  }
  const response = await fetch(
    `${bisafansBaseUrl}/spiele/editionen/legenden-arceus/hisui-dex.php`,
  );
  if (!response.ok) throw new Error("fetching error (dex)");
  const doc = domParser.parseFromString(await response.text(), "text/html");
  if (!doc) throw new Error("parsing error (dex)");
  const dexTableRows = [
    ...doc.querySelectorAll("table > tbody > tr"),
  ] as Element[];
  if (!dexTableRows.length) throw new Error("query error (dex)");
  let i = 0;
  const dexData: DexEntry[] = await Promise.all(
    dexTableRows.map(async (row) => {
      const [indexCell, pokemonCell] = [
        ...row.querySelectorAll("td"),
      ] as Element[];
      const index = parseInt(indexCell.textContent.substring(1));
      const name = pokemonCell.querySelector("a")?.textContent.trim();
      if (!name) throw new Error("name not found");
      const sprite = pokemonCell.querySelector("img")?.getAttribute("src");
      if (!sprite) throw new Error("sprite not found");
      const link = pokemonCell.querySelector("a")?.getAttribute("href");
      if (!link) throw new Error("link not found");
      const tasks = await loadTasks(link);
      console.log("loaded", ++i, "/", dexTableRows.length);
      return { index, name, sprite, link, tasks };
    }),
  );
  Deno.writeTextFileSync(dexFilePath, JSON.stringify(dexData, null, 2));
  console.log("dex file generated", dexFilePath);
  return dexData;
}

async function loadTasks(link: string): Promise<Task[]> {
  const response = await fetch(link);
  if (!response.ok) throw new Error("fetching error (task)", { cause: link });
  const doc = domParser.parseFromString(await response.text(), "text/html");
  if (!doc) throw new Error("parsing error (task)", { cause: link });
  const taskRows = [
    ...doc.querySelectorAll("h3 + p + div > table > tbody > tr"),
  ] as Element[];
  if (!taskRows.length) {
    //throw new Error('query error (task)', { cause: link });
    console.warn("missing task table", link);
    return [];
  }
  const tasks: Task[] = [];
  for (const row of taskRows) {
    const [titleCell, ...levelCells] = [
      ...row.querySelectorAll("td"),
    ] as Element[];
    const title = titleCell.textContent.trim();
    const levels = levelCells.map((cell) => parseInt(cell.textContent) || 0);
    tasks.push({ title, levels });
  }
  return tasks;
}

const dex = await loadDex();
const server = new Server();
server.get(
  "/",
  new Response(null, {
    status: STATUS_CODE.SeeOther,
    headers: { "location": "/dex" },
  }),
);
server.get("/dex", () => {
  return new HTMLResponse(
    <html lang={"de"}>
      <head>
        <title>Pokémon Legenden: Wolfgang | Hisui PokéDex</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body style="display: flex;">
        <div id="dex">
          <table id="selection">
            <tr>
              <th>
                <span>Suche</span>
              </th>
              <td>
                <input id="search" type="text"></input>
              </td>
            </tr>
            <tr>
              <th>
                <span>Filter</span>
              </th>
              <td>
                <select id="filter">
                  <option value="all">alle</option>
                  <option value="pinned">angepinnt</option>
                  <option value="done">erledigt</option>
                  <option value="in progress">angefangen</option>
                  <option value="new">neu</option>
                </select>
              </td>
            </tr>
          </table>
          <table id="dexTable">
            <tbody>
              {dex.map(({ index, name, sprite, tasks }) => {
                return (
                  <tr id={`dex-${index}`} data-filter={"new"}>
                    <td>#&nbsp;{index.toString().padStart(3, "0")}</td>
                    <td style="text-align: center;">
                      <img src={sprite}></img>
                    </td>
                    <td>{name}</td>
                    <td>
                      {tasks.map(() => <input type="checkbox" />)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div id="tasks">
          <table>
            <thead>
              <tr>
                <th>Aufgaben</th>
                <td colSpan={5} style="width: 50%"></td>
              </tr>
            </thead>
            {dex.map(({ index, tasks }) => (
              <tbody id={`tasks-${index}`} hidden={true}>
                {tasks.map(({ title, levels }, taskIdx) => (
                  <tr data-task={taskIdx}>
                    <th>{title}</th>
                    {levels.map((level, levelIdx) => {
                      if (!level) {
                        return <td></td>;
                      }
                      return (
                        <td data-level={levelIdx - levels.filter(l => !l).length}>
                          <span>{level}</span>
                          <input type="checkbox"></input>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <script src="/static/client.js"></script>
      </body>
    </html>,
  );
});
server.get(
  "/static/style.css",
  async () =>
    new Response(await Deno.readFile(`${import.meta.dirname}/style.css`), {
      headers: { "Content-Type": "text/css" },
    }),
);
server.get(
  "/static/client.js",
  async () =>
    new Response(await Deno.readFile(`${import.meta.dirname}/client.js`), {
      headers: { "Content-Type": "application/javascript" },
    }),
);
const wsClients: Record<string, WebSocket> = {};
server.get("/ws", ({ request }) => {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: STATUS_CODE.NotImplemented });
  }
  const uuid = crypto.randomUUID();
  const { socket, response } = Deno.upgradeWebSocket(request);
  socket.addEventListener("open", () => {
    wsClients[uuid] = socket;
  });
  socket.addEventListener("close", () => {
    delete wsClients[uuid];
  });
  socket.addEventListener("message", (ev) => {
    let data: unknown;
    try {
      data = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    if (!data || typeof data !== "object" || !("type" in data)) return;
    let saveFile: SaveData;
    try {
      saveFile = JSON.parse(Deno.readTextFileSync(saveFilePath));
    } catch (e) {
      saveFile = {};
    }
    if (data.type === "update") {
      const { id, task, level, state } = data as TaskUpdate;
      const dexData = dex.find((d) => d.index === parseInt(id));
      if (!dexData) {
        console.warn("unknown id", id);
        return;
      }
      if (!saveFile[id]) {
        saveFile[id] = dexData.tasks.map((t) =>
          new Array(t.levels.filter((l) => l).length).fill(0)
        );
      }
      if (!saveFile[id][task]) {
        saveFile[id][task] = new Array(
          dexData.tasks[task].levels.filter((l) => l).length,
        ).fill(0);
      }
      if (state) {
        for (let i = 0; i <= level; ++i) {
          saveFile[id][task]![i] = 1;
        }
      } else {
        for (let i = level; i < saveFile[id][task]!.length; ++i) {
          saveFile[id][task]![i] = 0;
        }
      }
      Deno.writeTextFileSync(saveFilePath, JSON.stringify(saveFile, null, 2));
    }
    socket.send(JSON.stringify(saveFile));
  });
  return response;
});
server.listen({ port: 3000 });
