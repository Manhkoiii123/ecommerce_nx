import express from "express";
import * as path from "path";
import cors from "cors";
import proxy from "express-http-proxy";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import initialSiteConfig from "./libs/initialSiteConfig";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.set("trust proxy", 1);

// rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

app.use("/product", proxy("http://localhost:6002"));
app.use("/", proxy("http://localhost:6001")); // truy cập auth service (/8080/ => sẽ chuyển hướng đến /6001)

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  try {
    initialSiteConfig();
  } catch (error) {}
});
server.on("error", console.error);
