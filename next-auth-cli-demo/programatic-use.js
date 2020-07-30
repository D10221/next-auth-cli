/**
 *  TODO
 */

console.log(
`
It may or may not work :)
If you compile/transpile ... probably yes, 
this is not a module
`
);

import index from "next-auth-cli";

index("driver://host/database"); // :)

const main = require("next-auth-cli");
main("driver://host/database"); // :)
