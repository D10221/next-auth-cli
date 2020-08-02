/**
 * Merge extra options
 * @param {{ [key: string]: any }} etc
 * */
export default function withOptions(etc) {
  /**
   * @param {[import("./types").ConnectionOptions, import("./types").Models]} args
   * @returns {[import("./types").ConnectionOptions, import("./types").Models]}
   * */
  function merge([config, models]) {
    return [{ ...config, ...etc }, models];
  }
  return merge;
}
