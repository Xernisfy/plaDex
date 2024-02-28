function update(/** @type {MessageEvent} */ ev) {
  /** @type {Record<string, (0|1|null)[][]>} */
  const data = JSON.parse(ev.data);
  for (const id in data) {
    const dexEntry = document.getElementById(`dex-${id}`);
    const tasksEntry = document.getElementById(`tasks-${id}`);
    let dexCompletion = 'new';
    let dexDone = true;
    for (const task in data[id]) {
      const tasksEntryRow =
        [...tasksEntry.querySelectorAll('tr')].filter((tr) =>
          tr.querySelector('input')
        )[task];
      let taskCompletion = 'new';
      let taskDone = true;
      for (const level in data[id][task]) {
        const state = data[id][task][level];
        if (state === null) continue;
        if (data[id][task][level]) taskCompletion = 'in progress';
        else taskDone = false;
        tasksEntryRow.querySelectorAll('input')[level].checked = !!state;
      }
      if (taskCompletion !== 'new' && taskDone) taskCompletion = 'done';
      if (taskCompletion !== 'new') dexCompletion = 'in progress';
      if (taskCompletion !== 'done') dexDone = false;
      dexEntry.querySelectorAll(`input[type="checkbox"]`)[task].checked =
        taskCompletion === 'done';
    }
    if (dexCompletion !== 'new' && dexDone) dexCompletion = 'done';
    dexEntry.dataset.filter = dexCompletion;
  }
  searchFilter();
}

const dex = document.getElementById('dexTable');
const tasks = document.getElementById('tasks');
let current;
dex.addEventListener('contextmenu', (event) => {
  const entry = event.target;
  if (entry.tagName !== 'TD') return;
  event.preventDefault();
  const x = entry.parentElement.dataset;
  if (x.pinned) delete x.pinned;
  else x.pinned = true;
  searchFilter();
});
dex.addEventListener('click', ({ target: entry }) => {
  if (entry.tagName !== 'TD') return;
  if (current) delete current.dataset.current;
  current = entry.parentElement;
  current.dataset.current = true;
  const currentTable = tasks.querySelector('tbody:not([hidden])');
  if (currentTable) currentTable.toggleAttribute('hidden');
  document.getElementById(`tasks-${current.id.substring(4)}`).removeAttribute(
    'hidden',
  );
});
const checkboxes = tasks.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((c) => {
  c.addEventListener('input', ({ target }) => {
    ws.send(JSON.stringify({
      type: 'update',
      id: current.id.substring(4),
      task: parseInt(target.parentElement.parentElement.dataset.task),
      level: parseInt(target.parentElement.dataset.level),
      state: target.checked,
    }));
  });
});

const ws = new WebSocket(`ws://${location.host}/ws`);
ws.addEventListener('open', () => {
  ws.addEventListener('message', update);
  ws.send(JSON.stringify({ type: 'init' }));
});

const dexEntries = dex.querySelectorAll('tr');
const search = document.getElementById('search');
const filter = document.getElementById('filter');
function searchFilter() {
  const filterValue = filter.value;
  const searchString = search.value.toLowerCase();
  for (const entry of dexEntries) {
    if (filterValue === 'all') {
      entry.hidden = false;
    } else if (filterValue === 'pinned') {
      entry.hidden = !entry.dataset.pinned;
    } else {
      entry.hidden = entry.dataset.filter !== filterValue;
    }
    if (entry.hidden) continue;
    if (!searchString) {
      entry.hidden = false;
    } else {
      entry.hidden = !entry.children[2].textContent.toLowerCase().includes(
        searchString,
      );
    }
  }
}
search.addEventListener('input', searchFilter, { passive: true });
filter.addEventListener('input', searchFilter, { passive: true });
