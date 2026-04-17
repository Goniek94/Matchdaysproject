/**
 * Central application logger.
 *
 * Dev  : human-readable console output.
 * Prod : structured JSON written to stderr — ready to be picked up by
 *        Datadog, CloudWatch, Sentry, etc.
 *
 * To plug in Sentry (or any other service) replace the `IS_PROD` block
 * with your SDK call, e.g.:
 *
 *   import * as Sentry from "@sentry/nextjs";
 *   Sentry.captureException(error);
 */

type Level = "debug" | "info" | "warn" | "error";

interface LogEntry {
  message: string;
  /** Caller identifier, e.g. "NotificationContext" */
  context?: string;
  /** Arbitrary structured data */
  data?: unknown;
  /** Error object or message */
  error?: unknown;
}

const IS_PROD = process.env.NODE_ENV === "production";

function serialiseError(error: unknown): string {
  if (error instanceof Error)
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ""}`;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function emit(level: Level, entry: LogEntry): void {
  if (IS_PROD) {
    // Only surface warn/error in production to keep log volume low.
    if (level === "debug" || level === "info") return;

    const payload = JSON.stringify({
      level,
      message: entry.message,
      context: entry.context,
      ...(entry.data !== undefined && { data: entry.data }),
      ...(entry.error !== undefined && { error: serialiseError(entry.error) }),
      timestamp: new Date().toISOString(),
    });

    // Use console.error so the line goes to stderr regardless of level.
    // Swap this for Sentry.captureException / datadogLogs.logger.error / etc.
    console.error(payload); // eslint-disable-line no-console
    return;
  }

  // ── Development ──────────────────────────────────────────────────────────────
  const tag = entry.context ? `[${entry.context}]` : "";
  const msg = `${tag} ${entry.message}`.trim();

  switch (level) {
    case "debug":
      console.debug(msg, entry.data ?? ""); // eslint-disable-line no-console
      break;
    case "info":
      console.info(msg, entry.data ?? ""); // eslint-disable-line no-console
      break;
    case "warn":
      console.warn(msg, entry.error ?? entry.data ?? ""); // eslint-disable-line no-console
      break;
    case "error":
      console.error(msg, entry.error ?? entry.data ?? ""); // eslint-disable-line no-console
      break;
  }
}

export const logger = {
  debug: (message: string, context?: string, data?: unknown) =>
    emit("debug", { message, context, data }),

  info: (message: string, context?: string, data?: unknown) =>
    emit("info", { message, context, data }),

  warn: (message: string, context?: string, error?: unknown) =>
    emit("warn", { message, context, error }),

  error: (message: string, context?: string, error?: unknown) =>
    emit("error", { message, context, error }),
};
