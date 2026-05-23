import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, ChevronDown, ChevronUp } from "lucide-react";
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
import ComingSoonModal from "@/components/ComingSoonModal";
import CommunityForumModal from "@/components/CommunityForumModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileByLocationOpen, setMobileByLocationOpen] = useState(false);
  const [mobileByCategoryOpen, setMobileByCategoryOpen] = useState(false);
  const [mobileByJobTypeOpen, setMobileByJobTypeOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [isFreelanceModalOpen, setIsFreelanceModalOpen] = useState(false);
  const [isCommunityForumOpen, setIsCommunityForumOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const locationMenuItems = locationSlugs.map((l) => ({
    name: l.name,
    href: l.slug === "remote" ? "/jobs?remote=true" : `/jobs/${l.slug}`,
  }));

  const categoryMenuItems = categories.map((c) => ({
    name: c.name,
    href: `/jobs?search=${encodeURIComponent(c.name)}`,
  }));

  const byJobTypeItems = [
    { name: "Full Time", href: "/jobs/types/full-time" },
    { name: "Part Time", href: "/jobs/types/part-time" },
    { name: "Contract", href: "/jobs/types/contract" },
    { name: "Internships", href: "/jobs/types/internship" },
    { name: "Remote", href: "/jobs/types/remote" },
  ];

  const careerToolkitItems = [
    { name: "AI Job Matcher", href: "/job-matcher" },
    { name: "Resume/CV Assistance", href: "/resume-cv-assistance" },
    { name: "Professional Profiles", href: "/professional-profiles" },
    { name: "Resource Center", href: "/resource-center" },
  ];

  const moreItems = [
    { name: "30-Day Job Sprint", href: "/30-day-job-sprint" },
    { name: "Company Directory", href: "/companies" },
    { name: "The Job Post Series", href: "/podcast" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

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
                <NavigationMenuTrigger>Browse Jobs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/jobs"
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            All South African Jobs
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Browse all available positions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {locationMenuItems.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.name}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>By Job Category</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[420px] p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Categories
                      </p>
                      <ul className="grid gap-2 md:grid-cols-2">
                        {categoryMenuItems.map((item) => (
                          <li key={item.name}>
                            <NavigationMenuLink asChild>
                              <Link to={item.href} className="block rounded-md p-2 text-sm hover:bg-accent">{item.name}</Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>By Job Type</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[360px] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Job Types
                    </p>
                    <ul className="grid gap-2">
                      {byJobTypeItems.map((item) => (
                        <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <Link to={item.href} className="block rounded-md p-2 text-sm hover:bg-accent">{item.name}</Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>More</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[560px] gap-4 p-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Career Toolkit
                      </p>
                      <ul className="space-y-1">
                        {careerToolkitItems.map((item) => (
                          <li key={item.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "block select-none rounded-md p-2 text-sm no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                )}
                              >
                                {item.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        More
                      </p>
                      <ul className="space-y-1">
                        {moreItems.map((item) => (
                          <li key={item.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className={cn(
                                  "block select-none rounded-md p-2 text-sm no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                )}
                              >
                                {item.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                        <li>
                          <button
                            type="button"
                            onClick={() => setIsCommunityForumOpen(true)}
                            className="block w-full rounded-md p-2 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            Community Forum
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => setIsFreelanceModalOpen(true)}
                            className="block w-full rounded-md p-2 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            Freelance Gigs
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/pro">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Become A Pro
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/pro">
                <Button variant="brand" size="sm">Become A Pro</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              to="/jobs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5"
              onClick={closeMobileMenu}
            >
              Browse Jobs
            </Link>

            <button
              onClick={() => setMobileByLocationOpen(!mobileByLocationOpen)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2.5 border-t border-border text-left"
            >
              By Location
              {mobileByLocationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {mobileByLocationOpen && (
              <div className="pl-4 flex flex-col gap-1 pb-2">
                {locationMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => setMobileByCategoryOpen(!mobileByCategoryOpen)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2.5 border-t border-border text-left"
            >
              By Job Category
              {mobileByCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {mobileByCategoryOpen && (
              <div className="pl-4 flex flex-col gap-1 pb-2">
                {categoryMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => setMobileByJobTypeOpen(!mobileByJobTypeOpen)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2.5 border-t border-border text-left"
            >
              By Job Type
              {mobileByJobTypeOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {mobileByJobTypeOpen && (
              <div className="pl-4 flex flex-col gap-1 pb-2">
                {byJobTypeItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2.5 border-t border-border text-left"
            >
              More
              {mobileMoreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {mobileMoreOpen && (
              <div className="pl-4 flex flex-col gap-1 pb-2">
                {careerToolkitItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                {moreItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsCommunityForumOpen(true);
                    closeMobileMenu();
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 text-left"
                >
                  Community Forum
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFreelanceModalOpen(true);
                    closeMobileMenu();
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1.5 text-left"
                >
                  Freelance Gigs
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <Link to="/profile" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-center">My Profile</Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-center" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-center">Sign In</Button>
                  </Link>
                  <Link to="/pro" onClick={closeMobileMenu}>
                    <Button variant="brand" className="w-full justify-center">Become A Pro</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <ComingSoonModal
        open={isFreelanceModalOpen}
        onOpenChange={setIsFreelanceModalOpen}
        title="Freelance Gigs Coming Soon"
        description="We’re building a dedicated freelance marketplace experience. Join the list and we’ll notify you as soon as it launches."
      />
      <CommunityForumModal
        open={isCommunityForumOpen}
        onOpenChange={setIsCommunityForumOpen}
      />
    </header>
  );
};

export default Navbar;
