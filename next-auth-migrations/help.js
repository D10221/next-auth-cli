/** */
export default function help(...args) {
  console.log(
    [
      "Usage:",
      `  --databaseUrl=<driver>://<user>:<password>@<server>[:port]/<databasename>`,
      `  --models=../path/to/my/models.js #(default export)`,
      `  Env:`,
      `     $DATABASE_URL # overrided by '--databaseUrl'`,
      typeof args === "string" && args,
      typeof args[0] === "string" && args[0],
    ]
      .filter(Boolean)
      .join("\n"),
    ...((typeof args[0] === "string" && args.slice(1)) || args || [])
  );
}
