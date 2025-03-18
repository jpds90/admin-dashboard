import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      axios: 'axios/dist/axios.min.js',  // Alias opcional, se necessário
    }
  }
});
