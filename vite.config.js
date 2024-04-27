import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ]
})


// import { defineConfig } from "vite";
// import { resolve } from "path";

// export default defineConfig({
//   build: {
//     rollupOptions: {
//       input: {
//         signUp: resolve(__dirname, "src/SignUp.jsx"), // Path to your SignUp component
//         loginPage: resolve(__dirname, "src/LoginPage.jsx"), // Path to your LoginPage component
//         chat: resolve(__dirname, "src/Chat.jsx"), // Path to your Chat component
//         otpVerification: resolve(__dirname, "src/Components/OTPVerification.jsx"), // Path to your OTPVerification component
//         // Add more entry points for other components as needed
//       },
//     },
//   },
// });
