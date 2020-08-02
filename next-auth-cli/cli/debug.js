import Debug from "debug";
import path from "path";
const base = "next-auth-cli";
/**
 * @param {string|undefined|null} url import.meta.url | module.__filename
 */
export default function createDebug(url) {
  try {
    if (!url) return Debug(base);
    return Debug(
      `${base}:${path.basename(url).replace(path.extname(url), "")}`
    );
  } catch {
    return Debug(base);
  }
}
