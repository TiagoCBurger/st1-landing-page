import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { realpathSync } from "node:fs";

const root = process.cwd();
const rootReal = safeRealpath(root);
const lockPath = join(root, ".next/dev/lock");

const args = new Set(process.argv.slice(2));
const mode = args.has("--force")
  ? "force"
  : args.has("--install-guard")
    ? "install-guard"
    : "predev";

function safeRealpath(p) {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function killProcessTree(pid) {
  try {
    execSync(`pkill -P ${pid} 2>/dev/null || true`, { stdio: "ignore" });
  } catch {
    // ignore
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch {
    // ignore
  }
}

function cleanupDevLock() {
  if (!existsSync(lockPath)) {
    return;
  }

  try {
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    const pid = Number(lock?.pid);

    if (!pid) {
      unlinkSync(lockPath);
      console.log("[predev] Lock invalido removido.");
      return;
    }

    if (isProcessRunning(pid)) {
      console.log(`[predev] Encerrando servidor dev anterior (PID ${pid})...`);
      killProcessTree(pid);
      return;
    }

    unlinkSync(lockPath);
    console.log("[predev] Lock stale removido.");
  } catch {
    try {
      unlinkSync(lockPath);
      console.log("[predev] Lock corrompido removido.");
    } catch {
      // ignore
    }
  }
}

function cleanupPort(port) {
  const output = sh(`lsof -ti tcp:${port} -sTCP:LISTEN 2>/dev/null || true`).trim();

  if (!output) {
    return;
  }

  for (const pid of output.split("\n").filter(Boolean)) {
    const numericPid = Number(pid);
    if (!numericPid || numericPid === process.pid) {
      continue;
    }

    const command = sh(`ps -p ${numericPid} -o command= 2>/dev/null || true`).trim();

    if (command.includes("next")) {
      console.log(`[predev] Liberando porta ${port} (PID ${numericPid})...`);
      killProcessTree(numericPid);
    }
  }
}

/**
 * Ancestor PIDs of the current process (npm/shell that invoked this script),
 * so we never kill the very install/dev command we're guarding.
 */
function getAncestorPids() {
  const ancestors = new Set([process.pid]);
  let current = process.ppid;

  for (let i = 0; i < 25 && current && current > 1; i += 1) {
    ancestors.add(current);
    const parentOutput = sh(`ps -o ppid= -p ${current} 2>/dev/null`).trim();
    const parent = Number(parentOutput);
    if (!parent || ancestors.has(parent)) {
      break;
    }
    current = parent;
  }

  return ancestors;
}

function getCwdForPid(pid) {
  const output = sh(`lsof -a -d cwd -p ${pid} -Fn 2>/dev/null`);
  const line = output.split("\n").find((l) => l.startsWith("n"));
  return line ? line.slice(1) : null;
}

/**
 * Kills leftover node/npm/npx/pnpm/yarn processes that are still rooted in
 * this project's directory (stray `next build`, orphaned `npx` downloads,
 * accidental `pnpm`/`yarn` runs, etc). These are the #1 cause of "it worked
 * yesterday, now npm i / npm run dev just hangs" - a zombie process from a
 * previous session eats CPU and/or holds files open in this exact folder.
 *
 * mode="install-guard": conservative, runs before `npm install`. Leaves a
 *   legitimate running `next dev` alone, only kills build/npx/pnpm/yarn.
 * mode="predev" | "force": also kills stray `next build`/npx processes.
 */
function killStrayProjectProcesses({ includeDev }) {
  const ancestors = getAncestorPids();
  const psOutput = sh("ps -axo pid=,command=");

  const dangerousPattern = includeDev
    ? /\b(pnpm|yarn|next|npx)\b/i
    : /\b(pnpm|yarn|npx)\b|next\s+build/i;

  const candidates = psOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(.*)$/);
      if (!match) return null;
      return { pid: Number(match[1]), command: match[2] };
    })
    .filter(Boolean)
    .filter(({ pid, command }) => {
      if (ancestors.has(pid)) return false;
      if (!dangerousPattern.test(command)) return false;
      if (!/node|npm|npx|pnpm|yarn/i.test(command)) return false;
      return true;
    });

  for (const { pid, command } of candidates) {
    const cwd = getCwdForPid(pid);
    if (!cwd) continue;

    const cwdReal = safeRealpath(cwd);
    if (cwdReal !== rootReal) continue;

    console.log(`[predev] Encerrando processo orfao/perdido (PID ${pid}): ${command}`);
    killProcessTree(pid);
  }
}

killStrayProjectProcesses({ includeDev: mode === "force" });

if (mode !== "install-guard") {
  cleanupDevLock();
  cleanupPort(3000);
}
