import yuteLogo from "../../../reference/yute.svg";
import monogamyLogo from "../../../reference/monogamy.svg";

const platforms = [
  {
    name: "YUTE™",
    description:
      "A turnkey, AI-powered companion for financial growth, learning and networking. YUTE™ is a next-generation financial wellness and literacy platform designed to help users build confidence, capability and long-term financial resilience.",
    href: "https://yute.co.za",
    logoSrc: yuteLogo,
    logoAlt: "YUTE financial wellness platform logo",
  },
  {
    name: "Monogamy",
    description:
      "A peer-to-peer legal marketplace designed to connect qualified leads with a curated network of top-rated attorneys across multiple practice areas and African markets.",
    href: "https://monogamy.legal",
    logoSrc: monogamyLogo,
    logoAlt: "Monogamy legal marketplace logo",
  },
];

const RelatedPlatformsSection = () => {
  return (
    <section
      aria-labelledby="related-platforms-heading"
      className="py-16 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(20,24,62,0.08)] p-6 sm:p-10">
          <div className="mb-8">
            <h2 id="related-platforms-heading" className="text-2xl md:text-3xl font-bold text-foreground">
              Discover other related platforms…
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore complementary platforms from the wider Jobbyist ecosystem, set to launch across Q3 and Q4 2026.
            </p>
          </div>

          <ul className="space-y-4">
            {platforms.map((platform) => (
              <li key={platform.name}>
                <article className="rounded-2xl border border-border/60 bg-background/80 p-4 sm:p-6 transition-colors hover:border-primary/40 focus-within:border-primary/50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    <div className="w-full sm:w-40 h-16 rounded-xl bg-white border border-border/60 flex items-center justify-center shrink-0">
                      <img
                        src={platform.logoSrc}
                        alt={platform.logoAlt}
                        className="max-h-10 w-auto object-contain"
                        width={128}
                        height={40}
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-semibold text-foreground">{platform.name}</h3>
                      <p className="mt-2 text-sm sm:text-base text-muted-foreground">{platform.description}</p>
                      <a
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm"
                      >
                        Learn More <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RelatedPlatformsSection;
