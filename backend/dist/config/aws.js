"use strict";
// import { S3Client } from "@aws-sdk/client-s3";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rdsConfig = exports.s3Config = exports.s3Client = exports.awsConfig = void 0;
// Konfiguracja AWS
exports.awsConfig = {
    region: process.env["AWS_REGION"] || "us-east-1",
    credentials: {
        accessKeyId: process.env["AWS_ACCESS_KEY_ID"] || "",
        secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] || "",
    },
};
// Konfiguracja S3
// export const s3Client = new S3Client(awsConfig);
exports.s3Client = {}; // Pusta implementacja zamiast S3Client
// Konfiguracja S3
exports.s3Config = {
    bucketName: process.env["S3_BUCKET"] || "",
    region: process.env["S3_REGION"] || "us-east-1",
};
// Konfiguracja RDS
exports.rdsConfig = {
    host: process.env["DB_HOST"] || "",
    port: parseInt(process.env["DB_PORT"] || "3306"),
    database: process.env["DB_NAME"] || "",
    user: process.env["DB_USER"] || "",
    password: process.env["DB_PASSWORD"] || "",
};
