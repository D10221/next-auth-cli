import assert from "assert";
import migration, {
  setup,
  loadConfig,
  transform,
  toTables,
} from "next-auth-migrations";
import Adapters from "next-auth/adapters.js";
import typeorm from "typeorm";
import namingStrategies from "next-auth/dist/adapters/typeorm/lib/naming-strategies.js";

const entities = [
  new typeorm.EntitySchema(Adapters.TypeORM.Models.User.schema),
  new typeorm.EntitySchema(Adapters.TypeORM.Models.Account.schema),
  new typeorm.EntitySchema(Adapters.TypeORM.Models.Session.schema),
  new typeorm.EntitySchema(Adapters.TypeORM.Models.VerificationRequest.schema),
];

describe("next-auth-migrations", () => {
  it('"module" can be imported', () => {
    assert.equal(migration.name, "nextAuthMigration");
  });
  it('"module" can be dynamically imported', async () => {
    assert.equal(
      (await import("next-auth-migrations")).default.name,
      "nextAuthMigration"
    );
  });
  it('"module" doesn\'t leak imports', async () => {
    assert.strictEqual(
      (await import("next-auth-migrations")).default,
      migration
    );
  });
  it('"setup" populates connection confgiuration from database url', async () => {
    const [config, models] = await setup(
      "mssql://sa:123@localhost:1422/mydb?xyz=true"
    );
    assert.equal(models, undefined);
    assert.deepEqual(config, {
      type: "mssql",
      host: "localhost",
      port: 1422,
      username: "sa",
      password: "123",
      database: "mydb",
      xyz: true,
    });
  });
  it('loadConfig "sets defaults"', () => {
    const [config, models] = loadConfig([
      {
        type: "mssql",
        host: "localhost",
        port: 1422,
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
        type: "mssql",
        host: "localhost",
        port: 1422,
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
});
