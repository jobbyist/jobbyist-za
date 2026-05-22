import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, ChevronDown, ChevronUp, Clock3 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";
import { categories, locationSlugs } from "@/lib/categories";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileByLocationOpen, setMobileByLocationOpen] = useState(false);
  const [mobileByCategoryOpen, setMobileByCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const jobSeekerLinks = [
    { name: "Job Search", href: "/jobs" },
    { name: "AI Job Matcher", href: "/job-matcher" },
    { name: "Resume Builder", href: "/resume-builder" },
    { name: "Career Knowledge Hub", href: "/knowledge-hub" },
  ];

  const employerLinks = [
    { name: "Company Directory", href: "/companies" },
    { name: "Recruitment Suite", href: "/pro" },
    { name: "Employer Waitlist", href: "/waiting-list/za" },
  ];

  const candidateBuyerLinks = [
    { name: "Candidate Profiles", href: "/professional-profiles" },
    { name: "Access Request", href: "/contact" },
    { name: "Profile Buyer Waitlist", href: "/waiting-list/za" },
  ];

  const locationMenuItems = locationSlugs.map(l => ({
    name: l.name,
    href: l.slug === "remote" ? "/jobs?remote=true" : `/jobs/${l.slug}`,
  }));

  const categoryMenuItems = categories.map(c => ({
    name: c.name,
    href: `/jobs?search=${encodeURIComponent(c.name)}`,
  }));

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const ComingSoonItem = ({ label }: { label: string }) => (
    <span className="flex items-center gap-2 rounded-md p-3 text-sm text-muted-foreground cursor-not-allowed" aria-disabled="true" title="Coming soon">
      <Clock3 className="h-4 w-4" />
      {label} (Coming soon)
    </span>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/jobbyistza.svg" alt="Jobbyist" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Job Seeker Journey</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4 md:grid-cols-2">
                    {jobSeekerLinks.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link to={item.href} className="block rounded-md p-2 text-sm hover:bg-accent">{item.name}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Employer / Recruiter Journey</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4">
                    {employerLinks.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link to={item.href} className="block rounded-md p-2 text-sm hover:bg-accent">{item.name}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li><ComingSoonItem label="Enterprise Hiring API" /></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Candidate Profile Buyer Journey</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4">
                    {candidateBuyerLinks.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link to={item.href} className="block rounded-md p-2 text-sm hover:bg-accent">{item.name}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li><ComingSoonItem label="Bulk Profile Export" /></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Jobs by Location</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    {locationMenuItems.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link to={item.href} className={cn("block rounded-md p-2 text-sm hover:bg-accent")}>{item.name}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Jobs by Category</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-2 p-4 md:grid-cols-2">
                    {categoryMenuItems.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link to={item.href} className="block rounded-md p-2 text-sm hover:bg-accent">{item.name}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/jobs"><Button variant="hero" size="sm">Find Jobs</Button></Link>
          <Link to="/pro"><Button variant="outline" size="sm">For Employers</Button></Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.email?.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><User className="h-4 w-4 mr-2" />My Profile</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin" className="cursor-pointer"><Shield className="h-4 w-4 mr-2" />Admin Panel</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer"><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth"><Button variant="ghost" size="sm">Sign In</Button></Link>
          )}
        </div>

        <button className="md:hidden p-2 rounded-md focus-ring" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <div className="text-sm font-semibold text-foreground">Job Seeker Journey</div>
            {jobSeekerLinks.map((l)=><Link key={l.name} to={l.href} className="text-sm text-muted-foreground py-1.5" onClick={()=>setIsOpen(false)}>{l.name}</Link>)}
            <div className="text-sm font-semibold text-foreground pt-2 border-t border-border">Employer / Recruiter Journey</div>
            {employerLinks.map((l)=><Link key={l.name} to={l.href} className="text-sm text-muted-foreground py-1.5" onClick={()=>setIsOpen(false)}>{l.name}</Link>)}
            <div className="text-sm text-muted-foreground py-1.5">Enterprise Hiring API (Coming soon)</div>
            <div className="text-sm font-semibold text-foreground pt-2 border-t border-border">Candidate Profile Buyer Journey</div>
            {candidateBuyerLinks.map((l)=><Link key={l.name} to={l.href} className="text-sm text-muted-foreground py-1.5" onClick={()=>setIsOpen(false)}>{l.name}</Link>)}

            <button onClick={() => setMobileByLocationOpen(!mobileByLocationOpen)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2.5 border-t border-border text-left rounded-sm focus-ring">Jobs by Location {mobileByLocationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
            {mobileByLocationOpen && <div className="pl-4 flex flex-col gap-1 pb-2">{locationMenuItems.map((item)=><Link key={item.name} to={item.href} className="text-sm text-muted-foreground py-1.5" onClick={()=>setIsOpen(false)}>{item.name}</Link>)}</div>}

            <button onClick={() => setMobileByCategoryOpen(!mobileByCategoryOpen)} className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2.5 border-t border-border text-left rounded-sm focus-ring">Jobs by Category {mobileByCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
            {mobileByCategoryOpen && <div className="pl-4 flex flex-col gap-1 pb-2">{categoryMenuItems.slice(0,8).map((item)=><Link key={item.name} to={item.href} className="text-sm text-muted-foreground py-1.5" onClick={()=>setIsOpen(false)}>{item.name}</Link>)}</div>}

            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link to="/jobs" onClick={() => setIsOpen(false)}><Button variant="hero" className="w-full justify-center">Find Jobs</Button></Link>
              <Link to="/pro" onClick={() => setIsOpen(false)}><Button variant="outline" className="w-full justify-center">For Employers</Button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
