import dotenv from "dotenv";
import { join, dirname } from "path";
import { existsSync } from "fs";

__dirname =
    typeof __dirname !== "undefined" ? __dirname : dirname(import.meta.url);
/** */    
export default dotenv.config({
    path: existsSync(join(__dirname, ".env.local")) //allow shadow .env
        ? join(__dirname, ".env.local")
        : join(__dirname, ".env"),
});
