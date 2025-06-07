"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path")); // Używamy standardowego importu
// Upewnijmy się, że zmienne środowiskowe są wczytane
// (chociaż server.ts już to robi, dodanie tutaj nie zaszkodzi)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
dotenv_1.default.config();
console.log("DB_HOST:", process.env.DB_HOST); // Log do debugowania
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_DATABASE:", process.env.DB_NAME); // Zmienna w .env to DB_NAME
// Utwórz pulę połączeń
const pool = promise_1.default.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Używamy DB_NAME zgodnie z .env
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10, // Można dostosować
  queueLimit: 0, // Bez limitu kolejki
});
// Funkcja do testowania połączenia (opcjonalna, ale przydatna)
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Pomyślnie połączono z bazą danych MySQL!");
    connection.release(); // Zwolnij połączenie z powrotem do puli
  })
  .catch((err) => {
    console.error("❌ Błąd podczas łączenia z bazą danych:", err);
    // W realnej aplikacji można tu dodać logikę obsługi błędów krytycznych
  });
// Eksportuj pulę połączeń, aby można było jej używać w innych częściach aplikacji
exports.default = pool;
