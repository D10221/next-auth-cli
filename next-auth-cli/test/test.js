import assert from "assert";
import cli, { setup, loadConfig, transform, toTables } from "next-auth-cli";
import Adapters from "next-auth/adapters.js";
import typeorm from "typeorm";
import namingStrategies from "next-auth/dist/adapters/typeorm/lib/naming-strategies.js";

const entities = [
  new typeorm.EntitySchema(Adapters.TypeORM.Models.User.schema),
  new typeorm.EntitySchema(Adapters.TypeORM.Models.Account.schema),
  new typeorm.EntitySchema(Adapters.TypeORM.Models.Session.schema),
  new typeorm.EntitySchema(Adapters.TypeORM.Models.VerificationRequest.schema),
];

const CONNECTION_STRINGS = {
  MSSQL:
    "mssql://nextauth:password@localhost:1433/nextauth?entityPrefix=nextauth_",
  MONGODB:
    "mongodb://nextauth:password@localhost/nextauth?entityPrefix=nextauth_&synchronize=true",
  SQLITE: "sqlite://./temp/db.sqlite", // ... ?
  MYSQL: "TODO",
  POSTGRES: "TODO",
};

describe("next-auth-cli", () => {
  it('"module" can be imported', () => {
    assert.equal(cli.name, "nextAuthCli");
  });
  it('"module" can be dynamically imported', async () => {
    assert.equal((await import("next-auth-cli")).default.name, "nextAuthCli");
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
    assert.equal(config.namingStrategy.name, "CamelCaseNamingStrategy");
  });
  it('loadConfig "sets defaults"', () => {
    const [config, models] = loadConfig([
      {
        type: "anything",
        host: "localhost",
        port: 0,
        username: "sa",
        password: "123",
        database: "mydb",
        xyz: true,
      },
      Adapters.TypeORM.Models,
    ]);
    assert.deepEqual(
      {
        name: "nextauth",
        autoLoadEntities: true,
        entities,
        timezone: "Z",
        logging: false,
        namingStrategy: undefined,
        type: "anything",
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
    const [config /*, models */] = transform([
      expected,
      Adapters.TypeORM.Models,
    ]);
    assert.equal(typeof config.namingStrategy.tableName, "function");
    assert.equal(config.namingStrategy.tableName("thing"), "things");
  });
  it("converts models to typeorm.Table[] (toTables)", () => {
    const tables = toTables(Adapters.TypeORM.Models, {
      namingStrategy: new namingStrategies.SnakeCaseNamingStrategy(),
      entiPrefix: "nextauth_",
    });
    assert.deepEqual(
      tables.map((x) => x.name),
      ["accounts", "users", "sessions", "verification_requests"]
    );
  });
  it("runs on sqlite", async () => {
    await cli(CONNECTION_STRINGS.SQLITE);
  });
  it("runs on mongodb", async () => {
    await cli(CONNECTION_STRINGS.MONGODB);
  });
});
