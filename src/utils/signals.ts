import { signal } from "@preact/signals";
import { FilterProgressValue } from "../islands/FilterProgress.tsx";
import { FilterRegionValue } from "../islands/FilterRegion.tsx";
import { FilterTaskTypeValue } from "../islands/FilterTaskType.tsx";

export const filterName = signal<string>("");
export const filterProgress = signal<FilterProgressValue>("all");
export const filterRegion = signal<FilterRegionValue>("all");
export const filterTaskType = signal<FilterTaskTypeValue>("all");

export const saveData = signal<number[][]>([]);
export const dexIndex = signal<number>(0);
