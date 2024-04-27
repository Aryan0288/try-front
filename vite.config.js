// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import dotenv from 'dotenv';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//   ],
//   define:{
//     'process.env.REACT_APP_BASE_URL':JSON.stringify(process.env.REACT_APP_BASE_URL),
//   }
// })


import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        signUp: resolve(__dirname, "src/SignUp.js"), // Path to your SignUp component
        loginPage: resolve(__dirname, "src/LoginPage.js"), // Path to your LoginPage component
        chat: resolve(__dirname, "src/Chat.js"), // Path to your Chat component
        otpVerification: resolve(__dirname, "src/OTPVerification.js"), // Path to your OTPVerification component
        // Add more entry points for other components as needed
      },
    },
  },
});
