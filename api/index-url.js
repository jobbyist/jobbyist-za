import { GoogleAuth } from "google-auth-library";

const INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { url, type = "URL_UPDATED" } = req.body || {};

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "Missing URL",
      });
    }

    const allowedBaseUrl = process.env.JOBBYIST_BASE_URL;

    if (allowedBaseUrl && !url.startsWith(allowedBaseUrl)) {
      return res.status(400).json({
        success: false,
        error: "URL does not match the allowed Jobbyist base URL",
      });
    }

    const requiredEnvVars = [
      "GOOGLE_INDEXING_CLIENT_EMAIL",
      "GOOGLE_INDEXING_PRIVATE_KEY",
      "GOOGLE_INDEXING_PROJECT_ID",
    ];

    const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingEnvVars.length > 0) {
      return res.status(500).json({
        success: false,
        error: "Missing required environment variables",
        missing: missingEnvVars,
      });
    }

    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_INDEXING_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_INDEXING_PRIVATE_KEY.replace(/\\n/g, "\n"),
        project_id: process.env.GOOGLE_INDEXING_PROJECT_ID,
        token_uri:
          process.env.GOOGLE_INDEXING_TOKEN_URI ||
          "https://oauth2.googleapis.com/token",
      },
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();

    const response = await client.request({
      url: INDEXING_ENDPOINT,
      method: "POST",
      data: {
        url,
        type,
      },
    });

    return res.status(200).json({
      success: true,
      message: "URL submitted to Google Indexing API",
      data: response.data,
    });
  } catch (error) {
    console.error("Google Indexing API error:", error);

    return res.status(500).json({
      success: false,
      error: "Google Indexing API request failed",
      details: error.message,
    });
  }
}
