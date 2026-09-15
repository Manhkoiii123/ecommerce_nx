import { config } from "dotenv";
import path from "path";
import Redis from "ioredis";

config({ path: path.resolve(process.cwd(), ".env"), override: true });

const redisUrl = process.env["REDIS_URL"];

if (!redisUrl) {
  throw new Error(
    "REDIS_URL is not set. Add it to the root .env (e.g. rediss://default:TOKEN@xxx.upstash.io:6379).",
  );
}

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  console.error("[redis]", err.message);
});

export default redis;
