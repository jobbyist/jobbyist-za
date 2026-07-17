import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jobbyist - Find Your Dream Job in South Africa",
  description: "Discover thousands of job opportunities across South Africa. Connect with top employers and advance your career with Jobbyist.",
  keywords: ["jobs", "careers", "employment", "South Africa", "job search", "recruitment"],
  authors: [{ name: "Jobbyist" }],
  creator: "Jobbyist",
  publisher: "Jobbyist",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://za.jobbyist.africa",
    siteName: "Jobbyist",
    title: "Jobbyist - Find Your Dream Job in South Africa",
    description: "Discover thousands of job opportunities across South Africa. Connect with top employers and advance your career with Jobbyist.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
