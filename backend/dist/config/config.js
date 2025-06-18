'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require('dotenv'));
const path_1 = __importDefault(require('path'));
// Wczytaj główny .env z katalogu nadrzędnego (jeśli tam jest globalna konfiguracja)
// __dirname w backend/src/config/config.ts to app_flow_react/backend/src/config
// więc path.resolve(__dirname, "../../../.env") celuje w app_flow_react/.env
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
// Wczytaj lokalny .env z katalogu backend (app_flow_react/backend/.env)
// path.resolve(__dirname, "../../.env") celuje w app_flow_react/backend/.env
const backendEnvPath = path_1.default.resolve(__dirname, '../../.env');
const backendEnvResult = dotenv_1.default.config({ path: backendEnvPath });
if (backendEnvResult.error) {
  console.warn(
    `Warning: Could not load .env file from ${backendEnvPath}: ${backendEnvResult.error.message}`
  );
}
const isSandbox = process.env.ALLEGRO_ENV === 'sandbox';
exports.config = {
  port: parseInt(process.env.PORT || '3001', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allegroClientId: process.env.ALLEGRO_CLIENT_ID || '',
  allegroClientSecret: process.env.ALLEGRO_CLIENT_SECRET || '',
  allegroApiUrl: isSandbox ? 'https://api.allegro.pl.allegrosandbox.pl' : 'https://api.allegro.pl',
  allegroAuthTokenUrl: isSandbox
    ? 'https://allegro.pl.allegrosandbox.pl/auth/oauth/token'
    : 'https://allegro.pl/auth/oauth/token',
  allegroRedirectUri: process.env.ALLEGRO_REDIRECT_URI || '',
  allegroScope: process.env.ALLEGRO_SCOPE || 'allegro:api:profile:read',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbUsername: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME || 'your_database_name',
  dbDialect: process.env.DB_DIALECT || 'mysql',
  brightDataCustomerID: process.env.BRIGHT_DATA_CUSTOMER_ID || '',
  brightDataApiToken: process.env.BRIGHT_DATA_API_TOKEN || '',
};
// Walidacja kluczowych zmiennych Allegro
if (!exports.config.allegroClientId) {
  console.warn('OSTRZEŻENIE: Zmienna środowiskowa ALLEGRO_CLIENT_ID nie jest ustawiona!');
}
if (!exports.config.allegroClientSecret) {
  console.warn('OSTRZEŻENIE: Zmienna środowiskowa ALLEGRO_CLIENT_SECRET nie jest ustawiona!');
}
