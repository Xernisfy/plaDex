import { existsSync } from "jsr:@std/fs";

export const cacheDir = ".cache/";
export async function cacheFile(url: string) {
  const { hostname, pathname } = new URL(url);
  const path = cacheDir + hostname + pathname;
  if (existsSync(path)) return;
  Deno.mkdirSync(path.replace(/[^\/]*$/, ""), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) {
    console.warn("Error loading " + url);
    return;
  }
  await response.body?.pipeTo(
    (await Deno.open(path, { create: true, truncate: true, write: true })).writable,
  );
}
export async function readCachedFile(url: string) {
  const { hostname, pathname } = new URL(url);
  const path = cacheDir + hostname + pathname;
  try {
    return Deno.readFileSync(path);
  } catch {
    Deno.mkdirSync(path.replace(/[^\/]*$/, ""), { recursive: true });
    const bytes = await (await fetch(url)).bytes();
    Deno.writeFileSync(path, bytes);
    return bytes;
  }
}
