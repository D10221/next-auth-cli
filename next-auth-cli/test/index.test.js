import assert from "assert";
import cli from "next-auth-cli";
import typeorm from "typeorm";
import {
  loadConfig,
  Models,
  namingStrategies,
  transform,
} from "../cli/internal.js";
import setup from "../cli/setup.js";
import toTables from "../cli/to-tables.js";

const entities = [
  new typeorm.EntitySchema(Models.User.schema),
  new typeorm.EntitySchema(Models.Account.schema),
  new typeorm.EntitySchema(Models.Session.schema),
  new typeorm.EntitySchema(Models.VerificationRequest.schema),
];

const CONNECTION_STRINGS = {
  MSSQL:
    "mssql://nextauth:password@localhost:1433/nextauth?entityPrefix=nextauth_",
  MONGODB:
    "mongodb://nextauth:password@localhost/nextauth?entityPrefix=nextauth_&synchronize=true",
  SQLITE: "sqlite://./temp/db.sqlite", // ... ?
  MYSQL: "mysql://nextauth:password@127.0.0.1:3306/nextauth?synchronize=true",
  POSTGRES:
    "postgres://nextauth:password@127.0.0.1:5432/nextauth?synchronize=true",
};

describe("next-auth-cli", () => {
  it('"module" can be imported', () => {
    assert.equal(cli.name, "next-auth-cli");
  });

  it('"module" can be dynamically imported', async () => {
    assert.equal((await import("next-auth-cli")).default.name, "next-auth-cli");
  });

  it('"module" doesn\'t leak imports', async () => {
    assert.strictEqual((await import("next-auth-cli")).default, cli);
  });

  it('"setup" populates connection configuration from database url', async () => {
    const [config, models] = await setup(
      "sql://u:p@localhost:1/nextauth?entityPrefix=nextauth_"
    );
    assert.equal(models, undefined);
    assert.deepEqual(config, {
      type: "sql",
      host: "localhost",
      options: {},
      port: 1,
      username: "u",
      password: "p",
      database: "nextauth",
      entityPrefix: "nextauth_",
    });
  });

  it('"setup" assigns namingStrategy', async () => {
    const [config] = await setup(
      "anything://user:password@localhost/mydb?namingStrategy=CamelCaseNamingStrategy"
    );
    assert.equal(
      config.namingStrategy && config.namingStrategy.name,
      "CamelCaseNamingStrategy"
    );
  });

  it('loadConfig "sets defaults"', () => {
    /** @type{*} */
    const input = {
      type: "sqlite",
      host: "localhost",
      port: 0,
      username: "sa",
      password: "123",
      database: "mydb",
      xyz: true,
    };
    const [config, models] = loadConfig([input, Models]);
    assert.deepEqual(
      {
        type: "sqlite",
        autoLoadEntities: true,
        entities,
        timezone: "Z",
        logging: false,
        namingStrategy: undefined,
        name: "nextauth",
        host: "localhost",
        port: 0,
        username: "sa",
        password: "123",
        database: "mydb",
        xyz: true,
      },
      config
    );
    assert.equal(models.Account.schema.name, "Account");
    assert.equal(models.User.schema.name, "User");
    assert.equal(models.Session.schema.name, "Session");
    assert.equal(models.VerificationRequest.schema.name, "VerificationRequest");
  });

  it('transform "adds naming stratgy and mutates models"', () => {
    /** @type {*} */
    const expected = {
      name: "nextauth",
      autoLoadEntities: true,
      entities,
      timezone: "Z",
      logging: false,
      namingStrategy: undefined,
      type: "mssql",
      host: "localhost",
      port: 1422,
      username: "sa",
      password: "123",
      database: "mydb",
      xyz: true,
    };
    const [config /*, models */] = transform([expected, Models]);
    assert.equal(
      config.namingStrategy && typeof config.namingStrategy.tableName,
      "function"
    );
    assert.equal(
      config.namingStrategy &&
        config.namingStrategy.tableName &&
        config.namingStrategy.tableName("thing", undefined),
      "things"
    );
  });

  it("converts models to typeorm.Table[] (toTables)", () => {
    const tables = toTables(Models, {
      namingStrategy: new namingStrategies.SnakeCaseNamingStrategy(),
    });
    assert.deepEqual(
      tables.map((x) => x.name),
      ["accounts", "users", "sessions", "verification_requests"]
    );
  });

  it("syncs on sqlite", async () => {
    await cli.sync(CONNECTION_STRINGS.SQLITE);
  });

  it("syncs on mongodb", async () => {
    await cli.sync(CONNECTION_STRINGS.MONGODB);
  });

  it("syncs on postgres", async () => {
    await cli.sync(CONNECTION_STRINGS.POSTGRES);
  });

  it("syncs on mysql", async () => {
    await cli.sync(CONNECTION_STRINGS.MYSQL);
  });
});
