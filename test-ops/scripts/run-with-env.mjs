import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const [, , envFileArg, command, ...args] = process.argv;

if (!envFileArg || !command) {
  console.error("Usage: node scripts/run-with-env.mjs .env.local <command> [...args]");
  process.exit(1);
}

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnvFile(envFile) {
  const resolvedPath = path.resolve(envFile);

  if (!fs.existsSync(resolvedPath)) {
    console.warn(`[test-ops] ${envFile} 파일이 없어 현재 환경변수와 기본값으로 실행합니다.`);
    return {};
  }

  return fs.readFileSync(resolvedPath, "utf8")
    .split(/\r?\n/)
    .map(parseEnvLine)
    .filter(Boolean)
    .reduce((env, entry) => {
      env[entry.key] = entry.value;
      return env;
    }, {});
}

const env = {
  ...process.env,
  ...loadEnvFile(envFileArg),
};

const child = spawn(command, args, {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
