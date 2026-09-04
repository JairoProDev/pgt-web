import { spawn } from "node:child_process";
import { applyCmsEnv } from "./load-cms-env";

applyCmsEnv();

const child = spawn("npx", ["payload", "migrate"], {
  stdio: ["pipe", "inherit", "inherit"],
  env: process.env,
});
child.stdin?.write("y\n");
child.stdin?.end();

child.on("exit", (code) => process.exit(code ?? 1));
