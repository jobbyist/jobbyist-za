// Unified Resend email module. Single source of truth for all outbound email
// in the Jobbyist backend. Sends via Resend using support@jobbyist.co.za as
// the default sender, supports HTML/text/attachments, retries transient
// failures, and logs each send result.
//
// Usage:
//   import { sendEmail } from "../_shared/email.ts";
//   await sendEmail({ to, subject, html });

export interface EmailAttachment {
  filename: string;
  content: string; // base64-encoded
  contentType?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
  tags?: { name: string; value: string }[];
  /** Number of times to retry on transient failure. Defaults to 2 (3 attempts total). */
  retries?: number;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  attempts: number;
}

const DEFAULT_FROM = "Jobbyist <support@jobbyist.co.za>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    const msg = "RESEND_API_KEY not configured";
    console.error("[email]", msg);
    return { success: false, error: msg, attempts: 0 };
  }

  const payload: Record<string, unknown> = {
    from: opts.from || DEFAULT_FROM,
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
  };
  if (opts.html) payload.html = opts.html;
  if (opts.text) payload.text = opts.text;
  if (opts.replyTo) payload.reply_to = opts.replyTo;
  if (opts.cc) payload.cc = Array.isArray(opts.cc) ? opts.cc : [opts.cc];
  if (opts.bcc) payload.bcc = Array.isArray(opts.bcc) ? opts.bcc : [opts.bcc];
  if (opts.attachments?.length) payload.attachments = opts.attachments;
  if (opts.tags?.length) payload.tags = opts.tags;

  const maxAttempts = Math.max(1, (opts.retries ?? 2) + 1);
  let lastError = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log("[email] sent", {
          to: payload.to,
          subject: opts.subject,
          id: data?.id,
          attempt,
        });
        return { success: true, id: data?.id, attempts: attempt };
      }
      lastError = `HTTP ${res.status}: ${JSON.stringify(data)}`;
      console.warn("[email] send failed", { attempt, lastError });
      // Retry only on 5xx / 429
      if (res.status < 500 && res.status !== 429) break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn("[email] send error", { attempt, lastError });
    }
    if (attempt < maxAttempts) await sleep(500 * attempt);
  }

  console.error("[email] permanently failed", { to: payload.to, subject: opts.subject, lastError });
  return { success: false, error: lastError, attempts: maxAttempts };
}

export const escapeHtml = (v = ""): string =>
  String(v).replace(/&(?![a-zA-Z0-9#]{1,20};)|[<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#039;",
  );
