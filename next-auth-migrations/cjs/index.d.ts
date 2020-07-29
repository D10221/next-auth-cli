/**
 * @param {import("typeorm").ConnectionOptions|string} config
 * @param {import("./types").Models|string} [models]
 * @param {(...args:any)=> any} [log]
 * @returns {Promise<void>}
 */
export default function _default(config: import("typeorm").ConnectionOptions | string, models?: string | import("./types").Models | undefined, log?: ((...args: any) => any) | undefined): Promise<void>;
