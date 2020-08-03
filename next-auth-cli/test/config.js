import typeorm from "typeorm";
import { Models } from "../cli/internal.js";

export const entities = [
  new typeorm.EntitySchema(Models.User.schema),
  new typeorm.EntitySchema(Models.Account.schema),
  new typeorm.EntitySchema(Models.Session.schema),
  new typeorm.EntitySchema(Models.VerificationRequest.schema),
];

export const CONNECTION_STRINGS = {
  MSSQL:
    "mssql://nextauth:password@localhost:1433/nextauth?entityPrefix=nextauth_",
  MONGODB:
    "mongodb://nextauth:password@localhost/nextauth?entityPrefix=nextauth_&synchronize=true",
  SQLITE: "sqlite://./temp/nextauth.sqlite",
  MYSQL: "mysql://nextauth:password@127.0.0.1:3306/nextauth?synchronize=true",
  POSTGRES:
    "postgres://nextauth:password@127.0.0.1:5432/nextauth?synchronize=true",
};
