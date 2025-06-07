const fs = require("fs");
const path = require("path");

// Ścieżka do katalogu node_modules
const nodeModulesPath = path.resolve(__dirname, "node_modules");
const tailwindPath = path.join(nodeModulesPath, "tailwindcss");

// Sprawdź, czy katalog tailwindcss istnieje
if (fs.existsSync(tailwindPath)) {
  // Stwórz plik version.js
  const versionPath = path.join(tailwindPath, "version.js");

  // Pobierz wersję z package.json
  const packageJsonPath = path.join(tailwindPath, "package.json");
  const packageJson = require(packageJsonPath);
  const version = packageJson.version;

  // Zawartość pliku version.js
  const versionContent = `module.exports = "${version}";`;

  // Zapisz plik
  fs.writeFileSync(versionPath, versionContent);

  console.log(`Łatka Tailwind CSS zastosowana. Utworzono plik version.js z wersją ${version}`);
} else {
  console.error("Nie znaleziono katalogu tailwindcss w node_modules");
}
