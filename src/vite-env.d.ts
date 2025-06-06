/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // więcej zmiennych środowiskowych można dodać tutaj
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 