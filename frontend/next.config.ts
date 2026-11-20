import path from "node:path";
import type { NextConfig } from "next";

// The app's root is this folder. Without pinning it, Next infers the workspace
// root from lockfiles and can pick the repo root, writing its .next/ cache there.
const appRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) for the Docker image.
  output: "standalone",
  turbopack: { root: appRoot },
  // Must match turbopack.root; keeps .next/standalone/server.js at the bundle's top level.
  outputFileTracingRoot: appRoot,
};

export default nextConfig;
