export type DbDex = DbDexEntry[];
export type DbDexEntry = {
  name: string;
  nationalDex: string;
  regions: string[];
  sprite: string;
  tasks: DbTask[];
  text: string;
};
export type DbTask = { title: string; steps: number[] };
