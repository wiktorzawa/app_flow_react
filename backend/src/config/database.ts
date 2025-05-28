import { Sequelize } from "sequelize";
import { config } from "./config";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
}); 