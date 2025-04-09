export function fmt(ext: string, text: Uint8Array) {
  const process = new Deno.Command("deno", {
    args: ["fmt", "--ext", ext, "-"],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).spawn();
  ReadableStream.from([text]).pipeTo(process.stdin);
  return process.stdout;
}
