import Document, { Html, Head, Main, NextScript } from "next/document";
import { JsonLd } from "../components/JsonLd";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://jobbyist.co.za/#organization",
  "name": "Jobbyist South Africa",
  "url": "https://jobbyist.co.za",
  "logo": {
    "@type": "ImageObject",
    "url": "https://jobbyist.co.za/logo.png"
  },
  "sameAs": [
    "https://www.linkedin.com/company/jobbyist",
    "https://www.facebook.com/jobbyist"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://jobbyist.co.za/#website",
  "name": "Jobbyist South Africa",
  "url": "https://jobbyist.co.za",
  "publisher": { "@id": "https://jobbyist.co.za/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://jobbyist.co.za/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <JsonLd schema={organizationSchema} />
          <JsonLd schema={websiteSchema} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
