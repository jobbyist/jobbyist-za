import logoImage from "@/assets/logo-footer.jpeg";

const Footer = () => {
  const footerLinks = {
    "For Job Seekers": [
      { name: "Browse Jobs", href: "#jobs" },
      { name: "Companies", href: "#companies" },
      { name: "Resume Builder", href: "#resume" },
      { name: "Career Resources", href: "#" },
    ],
    "For Employers": [
      { name: "Post a Job", href: "#" },
      { name: "Browse Candidates", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Recruitment Suite", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src={logoImage} 
              alt="Jobbyist" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-white/70 max-w-sm mb-6">
              Africa's premier job discovery and career management platform. 
              Connecting talent with opportunity across the continent.
            </p>
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
                    <a
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
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
