import Debug from "debug";
import path from "path";
const base = "next-auth-cli";
/**
 * @param {string} url import.meta.url | module.__filename
 */
export default function createDebug(url) {
  try {
    return Debug(
      `${base}:${path.basename(url).replace(path.extname(url), "")}`
    );
  } catch (error) {
    return Debug(base);
  }
}
