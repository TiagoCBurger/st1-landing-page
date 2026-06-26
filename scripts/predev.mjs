import { execSync } from "node:child_process";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lockPath = join(root, ".next/dev/lock");

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
  try {
    const output = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN 2>/dev/null || true`, {
      encoding: "utf8",
    }).trim();

    if (!output) {
      return;
    }

    for (const pid of output.split("\n").filter(Boolean)) {
      const numericPid = Number(pid);
      if (!numericPid || numericPid === process.pid) {
        continue;
      }

      try {
        const command = execSync(`ps -p ${numericPid} -o command= 2>/dev/null || true`, {
          encoding: "utf8",
        }).trim();

        if (command.includes("next")) {
          console.log(`[predev] Liberando porta ${port} (PID ${numericPid})...`);
          killProcessTree(numericPid);
        }
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}

cleanupDevLock();
cleanupPort(3000);
