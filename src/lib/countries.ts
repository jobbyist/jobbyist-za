export type CountryCode = 'ZA' | 'NG' | 'KE' | 'SZ' | 'BW' | 'ZM' | 'ZW' | 'MZ' | 'NA' | 'MW' | 'TZ';

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  isActive: boolean;
}

export const countries: Country[] = [
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', currencySymbol: 'R', isActive: true },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', currencySymbol: '₦', isActive: false },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', currencySymbol: 'KSh', isActive: false },
  { code: 'SZ', name: 'eSwatini', flag: '🇸🇿', currency: 'SZL', currencySymbol: 'E', isActive: false },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', currency: 'BWP', currencySymbol: 'P', isActive: false },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: 'ZMW', currencySymbol: 'K', isActive: false },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL', currencySymbol: '$', isActive: false },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', currency: 'MZN', currencySymbol: 'MT', isActive: false },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', currency: 'NAD', currencySymbol: '$', isActive: false },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', currency: 'MWK', currencySymbol: 'MK', isActive: false },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', currencySymbol: 'TSh', isActive: false },
];

export const activeCountries = countries.filter(c => c.isActive);
export const waitingListCountries = countries.filter(c => !c.isActive);

export function getCountryByCode(code: CountryCode): Country | undefined {
  return countries.find(c => c.code === code);
}

export function formatSalary(amount: number, countryCode: CountryCode): string {
  const country = getCountryByCode(countryCode);
  if (!country) return amount.toLocaleString();
  return `${country.currencySymbol} ${amount.toLocaleString()}`;
}
