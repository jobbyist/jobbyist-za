"use client";

import App from "../App";

/**
 * Main Next.js page that wraps the existing React application.
 * This preserves all existing routes and functionality during the Vite to Next.js migration.
 * The Upwork job listings feature is available at /upwork-jobs route.
 */
export default function Page() {
  return <App />;
}

