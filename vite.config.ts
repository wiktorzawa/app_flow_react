import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), flowbiteReact()],
  resolve: {
    alias: {
      "@shared-types": path.resolve(__dirname, "./shared-types"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});