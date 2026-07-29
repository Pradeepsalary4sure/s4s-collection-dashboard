// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), "");

//   return {
//     plugins: [react(), tailwindcss()],
//     server: {
//       proxy: {
//         "/api": {
// <<<<<<< HEAD
//           // target: env.VITE_API_PROXY_TARGET || "http://localhost:5000",
// =======
//           target: env.VITE_API_PROXY_TARGET || "https://s4s-collection-dashboard.onrender.com/",
// >>>>>>> 20ab99bc6a7a9ba4182eb2aa8c0ad955d294fcfc
//           changeOrigin: true,
//         },
//       },  
//     },
//   };
// });


import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target:
            env.VITE_API_PROXY_TARGET ||
            "https://s4s-collection-dashboard.onrender.com",
          changeOrigin: true,
        },
      },
    },
  };
});