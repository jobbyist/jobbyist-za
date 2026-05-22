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

const companyLogoMatchers: Array<{ match: string; logoUrl: string }> = [
  { match: 'discovery', logoUrl: discoveryLogo },
  { match: 'absa', logoUrl: absaLogo },
  { match: 'standard bank', logoUrl: standardLogo },
  { match: 'first national bank', logoUrl: fnbLogo },
  { match: 'fnb', logoUrl: fnbLogo },
  { match: 'nedbank', logoUrl: nedbankLogo },
  { match: 'sanlam', logoUrl: sanlamLogo },
  { match: 'shoprite', logoUrl: shopriteLogo },
  { match: 'vodacom', logoUrl: vodacomLogo },
  { match: 'mtn', logoUrl: mtnLogo },
  { match: 'econo', logoUrl: econoLogo },
];

const normalizeCompanyName = (companyName: string) =>
  ` ${companyName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

export const getCompanyLogoUrl = (companyName: string) => {
  const normalizedCompanyName = normalizeCompanyName(companyName);

  return (
    companyLogoMatchers.find(({ match }) => normalizedCompanyName.includes(` ${match} `))?.logoUrl ??
    null
  );
};
