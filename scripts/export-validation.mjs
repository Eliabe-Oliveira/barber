import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const client = new URL("client/", dist);
await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "apps/web", "-p", "4173"], {
  cwd: root, env: { ...process.env, NEXT_PUBLIC_VALIDATION_MODE: "1" }, stdio: "ignore"
});
try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { const response = await fetch("http://127.0.0.1:4173"); if (response.ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  for (const path of ["/", "/agendar", "/privacidade"]) {
    const response = await fetch(`http://127.0.0.1:4173${path}`);
    if (!response.ok) throw new Error(`Falha ao exportar ${path}`);
    const directory = path === "/" ? client : new URL(`.${path}/`, client);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL("index.html", directory), await response.text());
  }
  await mkdir(new URL("_next/", client), { recursive: true });
  await cp(new URL("apps/web/.next/static/", root), new URL("_next/static/", client), { recursive: true });
  await cp(new URL("apps/web/public/", root), client, { recursive: true });
  await mkdir(new URL("server/", dist), { recursive: true });
  await writeFile(new URL("server/index.js", dist), `export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.includes(".") && !url.pathname.endsWith("/")) url.pathname += "/";
    if (url.pathname.endsWith("/")) url.pathname += "index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};`);
  await mkdir(new URL(".openai/", dist), { recursive: true });
  await cp(new URL(".openai/hosting.json", root), new URL(".openai/hosting.json", dist));
} finally {
  server.kill("SIGTERM");
}
