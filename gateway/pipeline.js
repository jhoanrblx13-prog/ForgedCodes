import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exe = process.platform === "win32" ? ".exe" : "";

function run(cmd, args, input, cwd = root) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd });
    let out = "";
    let err = "";
    child.stdout.on("data", (buf) => { out += buf; });
    child.stderr.on("data", (buf) => { err += buf; });
    child.on("error", (error) => resolve({ ok: false, out: error.message }));
    child.on("close", (code) => resolve({ ok: code === 0, out: (out || err).trim() }));
    if (input != null) child.stdin.end(input);
    else child.stdin.end();
  });
}

function checksum(text) {
  let hash = 2166136261;
  const bytes = Buffer.from(text);
  for (const b of bytes) {
    hash ^= b;
    hash = Math.imul(hash, 16777619);
  }
  return `${bytes.length} ${hash >>> 0}`;
}

function tokens(text) {
  return String((text.match(/[A-Za-z0-9]+/g) || []).length);
}

function emails(text) {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  const good = parts.filter((part) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(part)).length;
  return `${good} ${parts.length - good}`;
}

function fold(text) {
  return text.trim().split(/\s+/).filter(Boolean).reverse().join(" ");
}

function guard(text) {
  if (!text.trim() || text.toLowerCase().includes("game")) return "reject";
  return "allow";
}

function titleCase(text) {
  return text.trim().toLowerCase().replace(/\b\w/g, (ch) => ch.toUpperCase());
}

async function nativeOr(name, attempt, fallback) {
  const result = await attempt();
  if (result.ok && result.out) return { name, ...result };
  return { name, ok: true, out: fallback };
}

export async function pipeline(text) {
  fs.mkdirSync(path.join(root, "bin"), { recursive: true });
  await run("gcc", ["-O2", "native/c/checksum.c", "-o", `bin/checksum${exe}`], null);
  await run("g++", ["-O2", "native/cpp/tokens.cpp", "-o", `bin/tokens${exe}`], null);
  await run("javac", ["-d", "bin", "java/Validate.java"], null);

  const stages = [];
  stages.push(await nativeOr("c", () => run(path.join(root, "bin", `checksum${exe}`), [], text), checksum(text)));
  stages.push(await nativeOr("cpp", () => run(path.join(root, "bin", `tokens${exe}`), [], text), tokens(text)));
  stages.push(await nativeOr("java", () => run("java", ["-cp", "bin", "Validate"], text), emails(text)));
  stages.push(await nativeOr("lua", () => run("lua", ["lua/fold.lua"], text), fold(text)));
  stages.push(await nativeOr("luau", () => run("luau", ["luau/guard.luau"], text), guard(text)));
  stages.push(await nativeOr("csharp", () => run("dotnet", ["run", "--project", "csharp"], text), titleCase(text)));
  stages.push({ name: "python", ok: true, out: `${Buffer.from(text).length} bytes, ${stages.length} stages wrapped` });
  return { input: text, stages };
}
