import Debug from "debug";
import path from "path";
const base = "next-auth-cli";
/**
 * create simple namespaced debug from import meta or name
 * @param {{ url: string}|{ filename: string}|string|null|undefined} arg import.meta.url | module.__filename
 */
export default function createDebug(arg) {
  try {
    return Debug([base, getBasename(getPath(arg))].filter(Boolean).join(":"));
  } catch {
    return Debug(base);
  }
}
/**
 *
 * @param {string|null|undefined} arg
 */
function getBasename(arg) {
  return arg && path.basename(arg).replace(path.extname(arg), "");
}
/**
 *
 * @param {{ url: string } | { filename: string } | string | null| undefined} arg
 */
function getPath(arg) {
  if (!arg) return "";
  if (typeof arg === "string") return arg;
  if ("url" in arg) return arg.url;
  if ("filename" in arg) return arg.filename;
  return "";
}
