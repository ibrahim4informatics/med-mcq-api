import app from "./app";
import ENV from "./config/ENV";
import { redis } from "./config/redis";

const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  redis.ping().then(() => {
    console.log("Connected to Redis");
  }).catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
  console.log(`Server running on port ${PORT}`);
});