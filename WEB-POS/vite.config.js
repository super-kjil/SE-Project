import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});

// // vite.config.js
// import { defineConfig } from "vite";

// export default defineConfig({
//   server: {
//     host: "0.0.0.0", // This allows access from external devices
//     port: 5173, // Default port
//   },
// });
