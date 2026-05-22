import { Link } from 'react-router-dom';
import { CookieSettingsLink } from '@/components/CookieConsent';

const Footer = () => {
  const footerLinks = {
    "Job Seeker Journey": [
      { name: "Job Search", href: "/jobs" },
      { name: "AI Job Matcher", href: "/job-matcher" },
      { name: "Upskilling Programs", href: "/upskilling" },
      { name: "Resume Builder", href: "/resume-builder" },
      { name: "Career Knowledge Hub", href: "/knowledge-hub" },
    ],
    "Employer / Recruiter Journey": [
      { name: "Company Directory", href: "/companies" },
      { name: "Recruitment Suite", href: "/pro" },
      { name: "Employer Waitlist", href: "/waiting-list/za" },
      { name: "Claim Your Company", href: "/contact" },
      { name: "Listing Policy", href: "/listing-policy" },
      { name: "Hiring Whitepaper (Coming soon)", href: "" },
    ],
    "Candidate Profile Buyer Journey": [
      { name: "Candidate Profiles", href: "/professional-profiles" },
      { name: "Request Access", href: "/contact" },
      { name: "Buyer Waitlist", href: "/waiting-list/za" },
      { name: "Bulk Profile Export (Coming soon)", href: "" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
      { name: "Cookies", href: "/cookies" },
      { name: "Data Rights", href: "/data-rights" },
      { name: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <img src="/jobbyistwhite.svg" alt="Jobbyist" className="h-12 w-auto mb-4" />
            <p className="text-white/85 max-w-sm mb-6">South Africa's leading job discovery and career management platform. Connecting SA talent with top opportunities worldwide.</p>
            <p className="text-sm text-white/70">© {new Date().getFullYear()} Jobbyist. All rights reserved.</p>
            <CookieSettingsLink className="mt-3 inline-block text-sm text-white/85 hover:text-white underline focus-ring rounded-sm" />
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {!link.href ? (
                      <span className="text-sm text-white/60 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                        {link.name}
                      </span>
                    ) : (
                      <Link to={link.href} className="text-sm text-white/85 hover:text-white transition-colors focus-ring rounded-sm">
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
  );
};

export default Footer;
