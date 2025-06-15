import "express-session";
import { UserTokenData } from "../services/allegroService"; // Upewnij się, że ścieżka jest poprawna

declare module "express-session" {
  interface SessionData {
    allegroAuth?: {
      verifier: string;
      state: string;
    };
    allegroTokens?: UserTokenData;
    // Możesz tu dodać inne niestandardowe pola sesji, jeśli będziesz ich potrzebować
    // np. userId?: number;
  }
}

// Opcjonalnie, jeśli chcesz mieć req.session zawsze zdefiniowane w typach (wymaga ostrożności):
// declare module "express" {
//   interface Request {
//     session: session.Session & Partial<session.SessionData>;
//   }
// }
