import type { ExecutionResult } from "./types";

/** True when ``execution_result`` carries a real query outcome (not an empty reset). */
export function hasExecutionResult(
  result: ExecutionResult | undefined | null,
): result is ExecutionResult {
  if (!result) return false;
  if (Object.keys(result).length === 0) return false;
  if (result.ok === true || result.ok === false) return true;
  if (result.error) return true;
  if ((result.rows?.length ?? 0) > 0) return true;
  if ((result.columns?.length ?? 0) > 0) return true;
  return false;
}
