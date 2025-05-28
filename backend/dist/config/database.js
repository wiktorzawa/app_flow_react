"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
exports.sequelize = new sequelize_1.Sequelize({
    dialect: "mysql",
    host: config_1.config.database.host,
    port: config_1.config.database.port,
    username: config_1.config.database.username,
    password: config_1.config.database.password,
    database: config_1.config.database.name,
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
