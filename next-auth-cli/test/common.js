import module from "module";
import path from "path";
import fs from "fs";
/** */
export const CONNECTION_STRINGS = {
  MSSQL: "mssql://nextauth:password@localhost:1433/nextauth",
  MONGODB: "mongodb://nextauth:password@localhost/nextauth",
  SQLITE: "sqlite://./temp/nextauth.sqlite",
  MYSQL: "mysql://nextauth:password@127.0.0.1:3306/nextauth",
  POSTGRES: "postgres://nextauth:password@127.0.0.1:5432/nextauth",
};
/** */
const req = module.createRequire(import.meta.url);
/** */
export const binLocation = path.join(
  path.dirname(req.resolve("next-auth-cli")),
  "cli/bin.js"
);
// reset sqlite file
let urlPath = CONNECTION_STRINGS.SQLITE.split("sqlite://")[1];
urlPath = path.isAbsolute(urlPath)
  ? urlPath
  : path.resolve(process.cwd(), urlPath);
/** */

export function unlinkSqlite() {
  if (fs.existsSync(urlPath)) {
    fs.unlinkSync(urlPath);
  }
}
