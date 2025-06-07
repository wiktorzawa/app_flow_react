import { defineConfig } from "vite";
import path from "path";
import flowbiteReact from "flowbite-react/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [flowbiteReact(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared-types": path.resolve(__dirname, "shared-types"),
    },
  },
});
