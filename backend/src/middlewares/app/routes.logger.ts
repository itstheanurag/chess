import type { Express } from "express";

/** Normalize and clean Express regex paths */
const cleanPath = (path: string): string => {
  return (
    path
      // Remove Express-specific regex tokens
      .replace(/\\\//g, "/")
      .replace(/\(\?:\^\)\?/g, "")
      .replace(/\(\?\=\\\/\|\$\)/g, "")
      .replace(/\/\?\(\?\=\/\|\$\)/g, "") // <- removes /?(?=/|$)
      .replace(/\^\?/g, "")
      .replace(/\$$/g, "")
      // Collapse multiple slashes
      .replace(/\/{2,}/g, "/")
      // Ensure leading slash
      .replace(/^(?!\/)/, "/")
      // Remove trailing slash (except root)
      .replace(/\/$/, "")
  );
};

export const logRoutes = (app: Express) => {
  const routes: { method: string; path: string }[] = [];

  const extractRoutes = (stack: any, basePath = "") => {
    stack.forEach((layer: any) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).map((m) =>
          m.toUpperCase()
        );
        const fullPath = cleanPath(basePath + layer.route.path);
        methods.forEach((method) => routes.push({ method, path: fullPath }));
      } else if (layer.name === "router" && layer.handle.stack) {
        const match = layer.regexp?.source ?? "";
        const prefix = cleanPath(
          match.replace("^\\", "/").replace("\\/?(?=\\/|$)", "")
        );
        extractRoutes(layer.handle.stack, basePath + prefix);
      }
    });
  };

  extractRoutes(app._router.stack);

  console.log("📜 Registered Routes:");
  routes.forEach((r) => console.log(`${r.method.padEnd(6)} ${r.path}`));
};
