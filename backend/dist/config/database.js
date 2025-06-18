'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sequelize = void 0;
const sequelize_1 = require('sequelize');
const config_1 = require('./config');
exports.sequelize = new sequelize_1.Sequelize({
  dialect: config_1.config.dbDialect,
  host: config_1.config.dbHost,
  port: config_1.config.dbPort,
  username: config_1.config.dbUsername,
  password: config_1.config.dbPassword,
  database: config_1.config.dbName,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});
