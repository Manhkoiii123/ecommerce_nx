import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 6001;
const server = app.listen(port, () => {
  console.log(`Auth service is running on port at http://${host}:${port}/api`);
});

server.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
