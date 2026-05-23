import { google } from "npm:googleapis@146.0.0";

const DEFAULT_BASE_URL = "https://za.jobbyist.africa";
const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";

type EnvValue = string | undefined;

type InsertedJob = {
  id?: string | number | null;
  slug?: string | null;
};

function getProcessEnv(name: string): EnvValue {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
}

function getEnv(name: string): EnvValue {
  return Deno.env.get(name) ?? getProcessEnv(name);
}

function getBaseUrl(): string {
  return (getEnv("JOBBYIST_BASE_URL") || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function getGoogleIndexingCredentials() {
  const clientEmail = getEnv("GOOGLE_INDEXING_CLIENT_EMAIL");
  const privateKey = getEnv("GOOGLE_INDEXING_PRIVATE_KEY")?.replace(/\\n/g, "\n");
  const projectId = getEnv("GOOGLE_INDEXING_PROJECT_ID");
  const tokenUri = getEnv("GOOGLE_INDEXING_TOKEN_URI") || "https://oauth2.googleapis.com/token";

  if (!clientEmail || !privateKey || !projectId) {
    return null;
  }

  return { clientEmail, privateKey, projectId, tokenUri };
}

function buildCanonicalJobUrl(insertedJob: InsertedJob): string | null {
  const baseUrl = getBaseUrl();

  if (insertedJob.slug) {
    return `${baseUrl}/jobs/${insertedJob.slug}`;
  }

  if (insertedJob.id) {
    return `${baseUrl}/job/${insertedJob.id}`;
  }

  return null;
}

export async function indexInsertedJob(insertedJob: InsertedJob | null | undefined): Promise<void> {
  if (!insertedJob) {
    return;
  }

  const jobUrl = buildCanonicalJobUrl(insertedJob);
  if (!jobUrl) {
    console.warn("[google-indexing] Skipped indexing: missing slug/id for inserted job.");
    return;
  }

  await indexJobUrl(jobUrl);
}

export async function indexJobUrl(jobUrl: string): Promise<void> {
  let validatedUrl: string;

  try {
    validatedUrl = new URL(jobUrl).toString();
  } catch {
    console.warn(`[google-indexing] Skipped invalid URL: ${jobUrl}`);
    return;
  }

  const credentials = getGoogleIndexingCredentials();
  if (!credentials) {
    console.warn(
      "[google-indexing] Skipped indexing: GOOGLE_INDEXING_CLIENT_EMAIL, GOOGLE_INDEXING_PRIVATE_KEY, or GOOGLE_INDEXING_PROJECT_ID is missing.",
    );
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey,
        project_id: credentials.projectId,
        token_uri: credentials.tokenUri,
      },
      scopes: [INDEXING_SCOPE],
    });

    const authClient = await auth.getClient();

    const indexing = google.indexing({
      version: "v3",
      auth: authClient,
    });

    await indexing.urlNotifications.publish({
      requestBody: {
        url: validatedUrl,
        type: "URL_UPDATED",
      },
    });

    console.log(`[google-indexing] Indexed URL_UPDATED: ${validatedUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown indexing error";
    console.error(`[google-indexing] Failed to index ${validatedUrl}: ${message}`);
  }
}
