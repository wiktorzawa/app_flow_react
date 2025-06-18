'use strict';
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
          step(generator['throw'](value));
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const path_1 = __importDefault(require('path')); // Import modułu path
const cors_1 = __importDefault(require('cors'));
const bcrypt_1 = __importDefault(require('bcrypt'));
const express_async_handler_1 = __importDefault(require('express-async-handler'));
const db_1 = __importDefault(require('./db')); // Import puli połączeń
const routes_1 = __importDefault(require('./routes')); // Import tras API
const express_session_1 = __importDefault(require('express-session')); // Import express-session
const crypto_1 = __importDefault(require('crypto')); // Do generowania secret
// Wczytaj najpierw główny .env (dla bazy danych itp.)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Następnie wczytaj lokalny backend/.env (może nadpisać niektóre zmienne jak PORT)
dotenv_1.default.config(); // Domyślnie szuka .env w bieżącym katalogu (backend)
// --- DEBUG: Sprawdź wczytaną wartość ALLEGRO_REDIRECT_URI ---
console.log(
  'DEBUG: ALLEGRO_REDIRECT_URI from process.env in server.ts:',
  process.env.ALLEGRO_REDIRECT_URI
);
// --- END DEBUG ---
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// --- Middleware ---
// CORS - Zezwalaj na żądania z frontendu (dostosuj origin w razie potrzeby)
app.use(
  (0, cors_1.default)({
    origin: (origin, callback) => {
      // Zezwalaj na żądania bez origin (np. z Postmana)
      if (!origin) return callback(null, true);
      // Zezwalaj na wszystkie żądania z localhost
      if (origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
// Parser JSON - aby Express rozumiał ciało żądania w formacie JSON
app.use(express_1.default.json());
// Middleware do obsługi sesji
// WAŻNE: W produkcji użyj bardziej bezpiecznego store, np. connect-redis, connect-mongo itp.
// oraz ustaw 'secure: true' jeśli używasz HTTPS.
// Sekret powinien być długim, losowym ciągiem znaków przechowywanym w zmiennych środowiskowych.
app.use(
  (0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || crypto_1.default.randomBytes(32).toString('hex'), // Użyj zmiennej środowiskowej!
    resave: false,
    saveUninitialized: false, // Zmień na true, jeśli chcesz zapisywać sesje od razu
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Używaj bezpiecznych ciasteczek w produkcji (HTTPS)
      httpOnly: true, // Pomaga chronić przed atakami XSS
      maxAge: 1000 * 60 * 60 * 24, // Czas życia ciasteczka sesji (np. 1 dzień)
    },
  })
);
// --- Routes ---
// Główny router API
app.use('/api', routes_1.default);
// Prosty endpoint testowy
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});
// Zmodyfikowany endpoint logowania z użyciem bazy danych
app.post(
  '/api/login',
  (0, express_async_handler_1.default)((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { username, password } = req.body;
      console.log(`--- Otrzymano żądanie /api/login dla: ${username} ---`);
      if (!username || !password) {
        res.status(400).json({ success: false, error: 'Username and password are required' });
        return;
      }
      let connection;
      try {
        // Pobierz połączenie z puli
        connection = yield db_1.default.getConnection();
        console.log('Pobrano połączenie z puli (login).');
        // Zapytanie do bazy danych o użytkownika (parametryzowane!)
        const sql = 'SELECT id_login, password_hash, role FROM login_auth_data WHERE email = ?';
        const [rows] = yield connection.execute(sql, [username]);
        console.log(`Znaleziono użytkowników (login): ${rows.length}`);
        if (rows.length === 0) {
          // Użytkownik nie znaleziony
          console.log(`Użytkownik ${username} nie znaleziony w bazie (login).`);
          res.status(401).json({ success: false, error: 'Invalid credentials' });
          return;
        }
        const user = rows[0];
        const storedHash = user.password_hash;
        const userRole = user.role;
        console.log(`Znaleziono użytkownika (login), rola: ${userRole}`);
        // Porównaj hasło
        console.log('Porównywanie hasła (login)...');
        console.log('Hash z bazy:', storedHash);
        const passwordString = String(password);
        console.log('Podane hasło:', passwordString);
        console.log('Długość hasła:', passwordString.length);
        console.log(
          'Kody znaków hasła:',
          [...passwordString].map((c) => c.charCodeAt(0))
        );
        // TYMCZASOWE ROZWIĄZANIE: Akceptuj hasło "test" dla wszystkich użytkowników
        let isMatch = false;
        if (passwordString === 'test') {
          console.log('Używam tymczasowego hasła testowego.');
          isMatch = true;
        } else if (userRole === 'supplier' && passwordString === 'dostawca') {
          console.log('Bezpośrednie dopasowanie dla dostawcy');
          isMatch = true;
        } else if (userRole === 'staff' && passwordString === 'pracownik') {
          console.log('Bezpośrednie dopasowanie dla pracownika');
          isMatch = true;
        } else {
          isMatch = yield bcrypt_1.default.compare(passwordString, storedHash);
        }
        console.log(`Wynik porównania hasła (login): ${isMatch}`);
        if (isMatch) {
          // Hasło pasuje
          console.log(`Logowanie pomyślne dla ${username}, rola: ${userRole}`);
          // Tu można dodać logikę sesji/tokenu JWT w przyszłości
          res.json({ success: true, userRole: userRole });
          return;
        } else {
          // Hasło nie pasuje
          console.log(`Nieprawidłowe hasło dla ${username} (login)`);
          res.status(401).json({ success: false, error: 'Invalid credentials' });
          return;
        }
      } catch (error) {
        console.error('Błąd podczas obsługi /api/login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      } finally {
        // Zawsze zwalniaj połączenie z powrotem do puli
        if (connection) {
          console.log('Zwalnianie połączenia (login)...');
          connection.release();
        }
      }
    })
  )
);
// Endpoint do wykonywania zapytań SQL
app.post(
  '/api/query',
  (0, express_async_handler_1.default)((req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { sql, params } = req.body;
      console.log('--- Otrzymano żądanie /api/query ---');
      if (!sql || typeof sql !== 'string') {
        console.log("Błąd /api/query: Brak lub nieprawidłowy parametr 'sql'");
        res.status(400).json({ success: false, error: 'SQL query string is required' });
        return;
      }
      if (params !== undefined && !Array.isArray(params)) {
        console.log("Błąd /api/query: Parametr 'params' nie jest tablicą");
        res.status(400).json({ success: false, error: 'Params must be an array' });
        return;
      }
      let connection;
      try {
        connection = yield db_1.default.getConnection();
        console.log('Pobrano połączenie z puli (query).');
        const [results] = yield connection.execute(sql, params || []);
        console.log('Zapytanie SQL wykonane pomyślnie (query).');
        res.json({ success: true, data: results });
        return;
      } catch (error) {
        console.error(`Błąd podczas wykonywania zapytania SQL (query):`, error);
        const dbError = error;
        res
          .status(500)
          .json({ success: false, error: `Database query failed: ${dbError.message}` });
        return;
      } finally {
        if (connection) {
          console.log('Zwalnianie połączenia (query)...');
          connection.release();
        }
      }
    })
  )
);
// --- Start Server ---
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
