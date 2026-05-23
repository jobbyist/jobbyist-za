import { useEffect, useMemo, useState } from "react";
import type { FocusEvent } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import homepageLogo01 from "../../../homepageassets/1.svg";
import homepageLogo02 from "../../../homepageassets/2.svg";
import homepageLogo03 from "../../../homepageassets/3.svg";
import homepageLogo04 from "../../../homepageassets/4.svg";
import homepageLogo05 from "../../../homepageassets/5.svg";
import homepageLogo06 from "../../../homepageassets/6.svg";
import homepageLogo07 from "../../../homepageassets/7.svg";
import homepageLogo08 from "../../../homepageassets/8.svg";
import homepageLogo09 from "../../../homepageassets/9.svg";
import homepageLogo10 from "../../../homepageassets/10.svg";
import homepageLogo11 from "../../../homepageassets/11.svg";
import homepageLogo12 from "../../../homepageassets/12.svg";

type PartnerLogo = {
  name: string;
  src: string;
  alt: string;
};

type PartnerLogoCarouselProps = {
  logos?: PartnerLogo[];
};

const defaultLogos: PartnerLogo[] = [
  { name: "Partner 1", src: homepageLogo01, alt: "" },
  { name: "Partner 2", src: homepageLogo02, alt: "" },
  { name: "Partner 3", src: homepageLogo03, alt: "" },
  { name: "Partner 4", src: homepageLogo04, alt: "" },
  { name: "Partner 5", src: homepageLogo05, alt: "" },
  { name: "Partner 6", src: homepageLogo06, alt: "" },
  { name: "Partner 7", src: homepageLogo07, alt: "" },
  { name: "Partner 8", src: homepageLogo08, alt: "" },
  { name: "Partner 9", src: homepageLogo09, alt: "" },
  { name: "Partner 10", src: homepageLogo10, alt: "" },
  { name: "Partner 11", src: homepageLogo11, alt: "" },
  { name: "Partner 12", src: homepageLogo12, alt: "" },
];

const placeholderLogos = Array.from({ length: 8 }, (_, index) => ({
  name: `Partner Placeholder ${index + 1}`,
}));

const PartnerLogoCarousel = ({ logos = defaultLogos }: PartnerLogoCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);

  const items = useMemo(() => (logos.length > 0 ? logos : placeholderLogos), [logos]);
  const hasRealLogos = logos.length > 0;

  useEffect(() => {
    if (!api || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [api, isPaused]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;

    if (!event.currentTarget.contains(nextFocusedElement)) {
      setIsPaused(false);
    }
  };

  return (
    <section
      className="py-10 bg-muted/20 border-y border-border/50"
      aria-labelledby="partner-logo-carousel-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div className="container mx-auto px-4">
        <h2
          id="partner-logo-carousel-title"
          className="text-xl md:text-2xl font-bold text-center mb-6"
        >
          Proudly brought to you by these world-class companies
        </h2>

        <div className="relative mx-auto max-w-6xl min-h-[170px]">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
            aria-label="Partner logos carousel"
            tabIndex={0}
          >
            <CarouselContent>
              {items.map((logo, index) => (
                <CarouselItem
                  key={`${logo.name}-${index}`}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                >
                  <div className="h-[126px] rounded-xl border border-border/80 bg-background/90 p-4 flex items-center justify-center">
                    {hasRealLogos && "src" in logo ? (
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                        className="max-h-14 w-auto object-contain"
                      />
                    ) : (
                      <span className="h-10 w-24 rounded-md bg-muted" aria-hidden="true" />
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 h-9 w-9" />
            <CarouselNext className="right-2 h-9 w-9" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default PartnerLogoCarousel;
