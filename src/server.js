import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import env from "./config/env.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
