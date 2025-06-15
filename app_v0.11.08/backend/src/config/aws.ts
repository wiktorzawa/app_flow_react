// import { S3Client } from "@aws-sdk/client-s3";

// Konfiguracja AWS
export const awsConfig = {
  region: process.env["AWS_REGION"] || "us-east-1",
  credentials: {
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"] || "",
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] || "",
  },
};

// Konfiguracja S3
// export const s3Client = new S3Client(awsConfig);
export const s3Client = {}; // Pusta implementacja zamiast S3Client

// Konfiguracja S3
export const s3Config = {
  bucketName: process.env["S3_BUCKET"] || "",
  region: process.env["S3_REGION"] || "us-east-1",
};

// Konfiguracja RDS
export const rdsConfig = {
  host: process.env["DB_HOST"] || "",
  port: parseInt(process.env["DB_PORT"] || "3306"),
  database: process.env["DB_NAME"] || "",
  user: process.env["DB_USER"] || "",
  password: process.env["DB_PASSWORD"] || "",
};
