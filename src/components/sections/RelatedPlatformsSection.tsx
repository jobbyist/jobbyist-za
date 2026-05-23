import { ExternalLink } from "lucide-react";

const platforms = [
  {
    name: "YUTE™",
    description:
      "A turnkey, AI-powered companion for financial growth, learning and networking. YUTE™ is a next-generation financial wellness and literacy platform designed to help users build confidence, capability and long-term financial resilience.",
    logoSrc: "/reference/yute.svg",
    logoAlt: "YUTE financial wellness platform logo",
    href: "https://yute.co.za",
  },
  {
    name: "Monogamy",
    description:
      "A peer-to-peer legal marketplace designed to connect qualified leads with a curated network of top-rated attorneys across multiple practice areas and African markets.",
    logoSrc: "/reference/monogamy.svg",
    logoAlt: "Monogamy legal marketplace logo",
    href: "https://monogamy.legal",
  },
];

const RelatedPlatformsSection = () => {
  return (
    <section aria-labelledby="related-platforms-title" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/50 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md md:p-8">
          <h2 id="related-platforms-title" className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Discover other related platforms…
          </h2>
          <p className="text-slate-600 mb-8">
            Explore complementary platforms from the wider Jobbyist ecosystem, launching across Q3 and Q4 2026.
          </p>

          <div className="space-y-4">
            {platforms.map((platform) => (
              <article
                key={platform.name}
                className="group rounded-xl border border-slate-200/80 bg-white/80 p-4 transition-colors hover:border-primary/40 focus-within:border-primary/40 md:p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                  <div className="flex h-20 w-full items-center justify-center rounded-lg bg-slate-50 md:w-44 shrink-0">
                    <img
                      src={platform.logoSrc}
                      alt={platform.logoAlt}
                      width={144}
                      height={64}
                      className="h-14 w-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{platform.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{platform.description}</p>
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:underline"
                    >
                      Learn More
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedPlatformsSection;
