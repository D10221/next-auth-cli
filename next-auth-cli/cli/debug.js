import Debug from "debug";
import path from "path";
const base = "next-auth-cli";
/**
 * @param {string} url import.meta.url | module.__filename
 */
export default (url) =>
  Debug(
    `${base}:${path
      .basename(url)
      .replace(path.extname(url), "")}`
  );
