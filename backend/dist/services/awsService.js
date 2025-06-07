"use strict";
// import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client, s3Config } from "../config/aws";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = exports.rdsService = void 0;
// Serwis do obsługi RDS
exports.rdsService = {
  executeQuery(sql_1) {
    return __awaiter(this, arguments, void 0, function* (sql, parameters = []) {
      try {
        const response = yield fetch("http://localhost:3000/api/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql, parameters }),
        });
        const data = yield response.json();
        if (!data.success) {
          throw new Error(data.error);
        }
        return data.data;
      } catch (error) {
        console.error("Error executing RDS query:", error);
        throw error;
      }
    });
  },
};
// Serwis do obsługi S3 - tymczasowo zakomentowany
exports.s3Service = {
  uploadFile(file, key) {
    return __awaiter(this, void 0, void 0, function* () {
      // Tymczasowo usunięto funkcjonalność AWS S3
      console.log("Funkcja uploadFile tymczasowo wyłączona");
      return { status: "mock", key };
      /*
            const command = new PutObjectCommand({
              Bucket: s3Config.bucketName,
              Key: key,
              Body: file,
            });
        
            try {
              const response = await s3Client.send(command);
              return response;
            } catch (error) {
              console.error("Error uploading file to S3:", error);
              throw error;
            }
            */
    });
  },
  getFile(key) {
    return __awaiter(this, void 0, void 0, function* () {
      // Tymczasowo usunięto funkcjonalność AWS S3
      console.log("Funkcja getFile tymczasowo wyłączona");
      return { status: "mock", key };
      /*
            const command = new GetObjectCommand({
              Bucket: s3Config.bucketName,
              Key: key,
            });
        
            try {
              const response = await s3Client.send(command);
              return response;
            } catch (error) {
              console.error("Error getting file from S3:", error);
              throw error;
            }
            */
    });
  },
};
