import absaLogo from '../../companylogos/absa.svg';
import discoveryLogo from '../../companylogos/discovery.svg';
import econoLogo from '../../companylogos/econo.svg';
import fnbLogo from '../../companylogos/fnb.svg';
import mtnLogo from '../../companylogos/mtn.svg';
import nedbankLogo from '../../companylogos/nedbank.svg';
import sanlamLogo from '../../companylogos/sanlam.svg';
import shopriteLogo from '../../companylogos/shoprite.svg';
import standardLogo from '../../companylogos/standard.svg';
import vodacomLogo from '../../companylogos/vodacom.svg';

const companyLogoPatterns: Array<{ pattern: RegExp; logoUrl: string }> = [
  { pattern: /\bdiscovery\b/, logoUrl: discoveryLogo },
  { pattern: /\babsa\b/, logoUrl: absaLogo },
  { pattern: /\bstandard bank\b/, logoUrl: standardLogo },
  { pattern: /\bfirst national bank\b/, logoUrl: fnbLogo },
  { pattern: /\bfnb\b/, logoUrl: fnbLogo },
  { pattern: /\bnedbank\b/, logoUrl: nedbankLogo },
  { pattern: /\bsanlam\b/, logoUrl: sanlamLogo },
  { pattern: /\bshoprite\b/, logoUrl: shopriteLogo },
  { pattern: /\bvodacom\b/, logoUrl: vodacomLogo },
  { pattern: /\bmtn\b/, logoUrl: mtnLogo },
  { pattern: /\becono\b/, logoUrl: econoLogo },
];

const normalizeCompanyName = (companyName: string) =>
  companyName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const getCompanyLogoUrl = (companyName: string) => {
  const normalizedCompanyName = normalizeCompanyName(companyName);

  return (
    companyLogoPatterns.find(({ pattern }) => pattern.test(normalizedCompanyName))?.logoUrl ?? null
  );
};
