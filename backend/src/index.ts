import cors from "cors";
import dotenv from "dotenv";
import express, { type ErrorRequestHandler } from "express";
import historyRouter from "./routes/history";
import mintRouter from "./routes/mint";
import statusRouter from "./routes/status";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const corsOrigin = process.env.CORS_ORIGIN ?? "*";

app.use(
  cors({
    origin: corsOrigin === "*" ? true : corsOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/mint", mintRouter);
app.use("/api/status", statusRouter);
app.use("/api/history", historyRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  const status = message.toLowerCase().includes("rate limit") ? 429 : 500;
  res.status(status).json({ success: false, error: message });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`ZKEntropy backend listening on port ${port}`);
});
