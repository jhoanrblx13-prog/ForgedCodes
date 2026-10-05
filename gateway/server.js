import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "./pipeline.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = express();
app.use(express.json());
app.use(express.static(path.join(root, "web")));

app.post("/api/run", async (req, res) => {
  const text = String(req.body?.text || "");
  if (!text.trim()) return res.status(400).json({ error: "text is required" });
  res.json(await pipeline(text));
});

const port = process.env.PORT || 8090;
app.listen(port, () => console.log(`http://127.0.0.1:${port}`));
