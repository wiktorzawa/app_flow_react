// import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client, s3Config } from "../config/aws";

// Serwis do obsługi RDS
export const rdsService = {
  async executeQuery(sql: string, parameters: (string | number | boolean | null)[] = []) {
    try {
      const response = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, parameters }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error) {
      console.error("Error executing RDS query:", error);
      throw error;
    }
  },
};

// Serwis do obsługi S3 - tymczasowo zakomentowany
export const s3Service = {
  async uploadFile(file: File, key: string) {
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
  },

  async getFile(key: string) {
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
  },
};
