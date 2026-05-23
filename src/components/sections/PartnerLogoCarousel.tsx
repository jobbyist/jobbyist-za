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

import absaLogo from "../../../partnerlogos/absa.svg";
import discoveryLogo from "../../../partnerlogos/discovery.svg";
import econoLogo from "../../../partnerlogos/econo.svg";
import fnbLogo from "../../../partnerlogos/fnb.svg";
import mtnLogo from "../../../partnerlogos/mtn.svg";
import nedbankLogo from "../../../partnerlogos/nedbank.svg";
import sanlamLogo from "../../../partnerlogos/sanlam.svg";
import shopriteLogo from "../../../partnerlogos/shoprite.svg";
import standardLogo from "../../../partnerlogos/standard.svg";
import vodacomLogo from "../../../partnerlogos/vodacom.svg";

type PartnerLogo = {
  name: string;
  src: string;
  alt: string;
};

type PartnerLogoCarouselProps = {
  logos?: PartnerLogo[];
};

const defaultLogos: PartnerLogo[] = [
  { name: "Absa", src: absaLogo, alt: "Jobbyist - Powered by Absa" },
  { name: "Discovery", src: discoveryLogo, alt: "Jobbyist - Powered by Discovery" },
  { name: "Econo", src: econoLogo, alt: "Jobbyist - Powered by Econo" },
  { name: "FNB", src: fnbLogo, alt: "Jobbyist - Powered by FNB" },
  { name: "MTN", src: mtnLogo, alt: "Jobbyist - Powered by MTN" },
  { name: "Nedbank", src: nedbankLogo, alt: "Jobbyist - Powered by Nedbank" },
  { name: "Sanlam", src: sanlamLogo, alt: "Jobbyist - Powered by Sanlam" },
  { name: "Shoprite", src: shopriteLogo, alt: "Jobbyist - Powered by Shoprite" },
  { name: "Standard", src: standardLogo, alt: "Jobbyist - Powered by Standard" },
  { name: "Vodacom", src: vodacomLogo, alt: "Jobbyist - Powered by Vodacom" },
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
