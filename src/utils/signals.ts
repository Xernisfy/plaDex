import { signal } from "@preact/signals";
import { FilterRegionValue } from "../islands/FilterRegion.tsx";

export const filterName = signal<string>("");
export const filterProgress = signal<boolean>(false);
export const filterRegion = signal<FilterRegionValue>("all");

export const sortOrder = signal<"dex" | "alpha">("dex");

export const saveData = signal<number[][]>([]);
export const dexIndex = signal<number>(0);
