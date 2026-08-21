import { execFileSync, spawnSync } from "node:child_process";
import { findRepositoryRoot } from "./manifest";

function trackedDiff(rootDir: string): Buffer {
  return execFileSync("git", ["diff", "--binary", "HEAD"], {
    cwd: rootDir,
    encoding: "buffer",
    maxBuffer: 50 * 1024 * 1024,
  });
}

function worktreePaths(rootDir: string): Buffer {
  return execFileSync(
    "git",
    ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
    { cwd: rootDir, encoding: "buffer", maxBuffer: 10 * 1024 * 1024 }
  );
}

const rootDir = findRepositoryRoot();
const beforeDiff = trackedDiff(rootDir);
const beforePaths = worktreePaths(rootDir);
const build = spawnSync("pnpm", ["--filter", "website", "build"], {
  cwd: rootDir,
  stdio: "inherit",
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const afterDiff = trackedDiff(rootDir);
const afterPaths = worktreePaths(rootDir);
if (!beforeDiff.equals(afterDiff) || !beforePaths.equals(afterPaths)) {
  console.error(
    "Documentation build mutated tracked files or introduced a non-ignored worktree path. Run git status and pnpm docs:generate to inspect the change."
  );
  process.exit(1);
}
console.log(
  "Documentation production build completed without worktree mutation."
);
