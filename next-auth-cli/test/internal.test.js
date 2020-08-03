import assert from "assert";
import fs from "fs";
import cli from "next-auth-cli";
import path from "path";
import { loadConfig, Models, transform } from "../cli/internal.js";
import setup from "../cli/setup.js";
import { CONNECTION_STRINGS, entities } from "./config.js";

// reset sqlite file
let urlPath = CONNECTION_STRINGS.SQLITE.split("sqlite://")[1];
urlPath = path.isAbsolute(urlPath)
  ? urlPath
  : path.resolve(process.cwd(), urlPath);
if (fs.existsSync(urlPath)) {
  fs.unlinkSync(urlPath);
}

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
});
