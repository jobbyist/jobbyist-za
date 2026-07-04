import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Facebook, Linkedin, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';
import CommunityForumModal from '@/components/CommunityForumModal';

// Brand X (Twitter) icon
const XIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.79l-4.86-6.36L5.2 22H2.44l6.96-7.96L1.5 2h6.94l4.39 5.82L18.244 2Zm-2.38 18h1.86L7.24 4H5.28l10.584 16Z"/>
  </svg>
);

const TikTokIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.05a8.16 8.16 0 0 0 4.77 1.52V7.15a4.85 4.85 0 0 1-1.84-.46Z"/>
  </svg>
);

const SubstackIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

const MediumIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42S20.96 8.46 20.96 12zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const WhatsAppIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.5 0 .17 5.34.17 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.55 0 11.88-5.34 11.88-11.9 0-3.18-1.24-6.17-3.43-8.44zM12.07 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.87 9.87 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.5.71.3 1.26.48 1.69.62.71.22 1.35.19 1.86.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/>
  </svg>
);

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com/JobbyistZA', Icon: Facebook },
  { label: 'X (Twitter)', href: 'https://x.com/JobbyistZA', Icon: XIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/jobbyist', Icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/@jobbyistZA', Icon: Youtube },
  { label: 'TikTok', href: 'https://tiktok.com/@JobbyistZA', Icon: TikTokIcon },
  { label: 'Substack', href: 'https://substack.com/@JobbyistZA', Icon: SubstackIcon },
  { label: 'Medium', href: 'https://jobbyist.medium.com', Icon: MediumIcon },
  { label: 'WhatsApp community', href: 'https://chat.whatsapp.com/EGeranViu3KG5lF2jDDBqE', Icon: WhatsAppIcon },
  { label: 'Google Business', href: 'https://g.page/r/CUM4KjhpOnLoEBM', Icon: Globe },
];

const Footer = () => {
  const { pathname } = useLocation();
  const [isCommunityForumOpen, setIsCommunityForumOpen] = useState(false);
  void pathname;

  const footerLinks = {
    'For Job Seekers': [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'AI Job Matcher', href: '/job-matcher' },
      { name: 'Upskilling Program', href: '/upskilling' },
      { name: 'Resume/CV Assistance', href: '/resume-cv-assistance' },
      { name: '90-Day Job Sprint', href: '/sprint' },
      { name: 'Resource Center', href: '/resource-center' },
      { name: 'Community Forum', href: 'https://chat.whatsapp.com/EGeranViu3KG5lF2jDDBqE', external: true },
    ],
    'For Employers': [
      { name: 'Company Directory', href: '/companies' },
      { name: 'Browse Candidates', href: '/professional-profiles' },
      { name: 'Whitepaper 2026/27', href: '/whitepaper' },
      { name: 'Recruitment Suite', href: '/recruitment-suite' },
      { name: 'The Job Post Series', href: '/podcast' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Data Rights', href: '/data-rights' },
      { name: 'Help Center', href: '/help-center' },
    ],
  };

  return (
    <>
      <CommunityForumModal open={isCommunityForumOpen} onOpenChange={setIsCommunityForumOpen} />
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img src="/jobbyistwhite.svg" alt="Jobbyist" className="h-12 w-auto mb-4" />
              <p className="text-white/70 max-w-sm mb-6">
                South Africa's leading job discovery and career management platform.
                Connecting SA talent with top opportunities worldwide.
              </p>

              {/* Contact */}
              <ul className="space-y-2 mb-6 text-sm text-white/80">
                <li>
                  <a href="mailto:support@jobbyist.co.za" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    support@jobbyist.co.za
                  </a>
                </li>
                <li>
                  <a href="tel:+27128806560" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    +27 12 880 6560
                  </a>
                </li>
                <li className="inline-flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Johannesburg, South Africa
                </li>
              </ul>

              {/* Socials */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-white/80 mb-3">Follow us</p>
                <ul className="flex flex-wrap gap-2">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* App Store Badges */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-white/80">Get the Mobile App</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://play.google.com/store/apps/details?id=za.jobbyist.app" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play" className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20">
                    <svg className="w-7 h-7" viewBox="0 0 512 512" aria-hidden="true">
                      <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z"/>
                      <path fill="#FBBC04" d="M104.6 13l220.7 221.3-220.7 220.8z"/>
                      <path fill="#4285F4" d="M385.4 174.2l99 57c11.4 6.6 11.4 24.9 0 31.5l-99 57.1-64-64.6z"/>
                      <path fill="#34A853" d="M104.6 455.1l280.8-161.3-64-64.6z"/>
                    </svg>
                    <div className="text-left"><div className="text-[10px] text-white/60 uppercase tracking-wide">Get it on</div><div className="text-sm font-semibold leading-tight">Google Play</div></div>
                  </a>
                  <a href="https://apps.apple.com/za/app/jobbyist/id0000000000" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store" className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left"><div className="text-[10px] text-white/60 uppercase tracking-wide">Download on the</div><div className="text-sm font-semibold leading-tight">App Store</div></div>
                  </a>
                </div>
              </div>

              <p className="text-sm text-white/50">
                © {new Date().getFullYear()} Jobbyist. All rights reserved.
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      {'external' in link && link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                          {link.name}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
