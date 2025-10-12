import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import app from "./app";
import { env } from "./config/env";

// Validate environment
console.log("🔧 Validating environment variables...");

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Airbook API Server running on port ${PORT}`);
  console.log(`📱 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
});
