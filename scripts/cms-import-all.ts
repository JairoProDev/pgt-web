import { spawn } from "node:child_process";

const neon = process.argv.includes("--neon") ? ["--neon"] : [];

function run(script: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("npx", ["tsx", script, ...neon], { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code) reject(new Error(`${script} exited ${code}`));
      else resolve();
    });
  });
}

await run("scripts/cms-import-tours.ts");
await run("scripts/cms-import-blogs.ts");
await run("scripts/cms-import-pages.ts");
await run("scripts/cms-assign-owners.ts");
