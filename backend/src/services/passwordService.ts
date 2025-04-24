export class PasswordService {
  // Logika haszowania i weryfikacji została przeniesiona na stronę serwera (backend).
  // Frontend wysyła teraz czyste hasło przez HTTPS, a backend używa
  // bezpiecznej biblioteki (np. bcrypt) do haszowania z unikalną solą
  // i weryfikacji.
  // Poniższe metody i stałe są usunięte, ponieważ nie są już potrzebne
  // w kodzie frontendu.
  // private static readonly SALT = "g1e4zeSDerGNW7dX";
  // private static readonly ITERATIONS = 600000;
  // private static readonly ALGORITHM = "SHA-256";
  // private static async hashString(str: string): Promise<string> {
  //   const encoder = new TextEncoder();
  //   const data = encoder.encode(str);
  //   const hashBuffer = await crypto.subtle.digest(this.ALGORITHM, data);
  //   const hashArray = Array.from(new Uint8Array(hashBuffer));
  //   return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  // }
  // public static async hashPassword(password: string): Promise<string> {
  //   const saltedPassword = password + this.SALT;
  //   let hashed = saltedPassword;
  //   for (let i = 0; i < this.ITERATIONS; i++) {
  //     hashed = await this.hashString(hashed);
  //   }
  //   return `pbkdf2:${this.ALGORITHM}:${this.ITERATIONS}$${this.SALT}$${hashed}`;
  // }
  // public static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  //   const newHash = await this.hashPassword(password);
  //   return newHash === hashedPassword;
  // }
}
