import { contentType, KnownExtensionOrType } from "jsr:@std/media-types";

export function contentTypeHeader(
  extensionOrType: KnownExtensionOrType,
): { headers: { "Content-Type": string } } {
  return {
    headers: { "Content-Type": contentType(extensionOrType) },
  };
}
