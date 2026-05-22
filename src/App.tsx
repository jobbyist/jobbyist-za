import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Preloader from "@/components/Preloader";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import CountryJobs from "./pages/CountryJobs";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import WaitingList from "./pages/WaitingList";
import Pro from "./pages/Pro";
import About from "./pages/About";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminScraper from "./pages/admin/AdminScraper";
import Builder from "./pages/Builder";
import JobMatcher from "./pages/JobMatcher";
import Jobseekers from "./pages/Jobseekers";
import JobseekerDetail from "./pages/JobseekerDetail";
import KnowledgeHub from "./pages/KnowledgeHub";
import ResumeBuilder from "./pages/ResumeBuilder";
import UpskillingProgram from "./pages/UpskillingProgram";
import Cookies from "./pages/Cookies";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DataRights from "./pages/DataRights";
import Contact from "./pages/Contact";
import LocationJobs from "./pages/LocationJobs";
import CategoryJobs from "./pages/CategoryJobs";
import FacetJobs from "./pages/FacetJobs";
import SitemapRedirect from "./pages/SitemapRedirect";
import Ads from "./pages/Ads";
import ProfessionalProfiles from "./pages/ProfessionalProfiles";
import ListingPolicy from "./pages/ListingPolicy";
import TrustSafety from "./pages/TrustSafety";
import RemoteSprintModal from "./components/RemoteSprintModal";
import ConciergeChat from "./components/ConciergeChat";
import { CookieConsentProvider } from "./components/CookieConsent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(() => {
    try {
      return sessionStorage.getItem('jobbyist:preloader-shown') !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      try { sessionStorage.setItem('jobbyist:preloader-shown', '1'); } catch {
        // Ignore sessionStorage write failures in restricted environments.
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CookieConsentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>
            <ScrollToTop />
            <RemoteSprintModal />
            <ConciergeChat />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pro" element={<Pro />} />
              <Route path="/about" element={<About />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/category/:category" element={<CategoryJobs />} />
              <Route path="/jobs/category/:category/:location" element={<CategoryJobs />} />
              <Route path="/jobs/provinces/:province" element={<FacetJobs mode="province" />} />
              <Route path="/jobs/cities/:city" element={<FacetJobs mode="city" />} />
              <Route path="/jobs/types/:type" element={<FacetJobs mode="type" />} />
              <Route path="/jobs/categories/:category" element={<FacetJobs mode="category" />} />
              <Route path="/jobs/combo/:location/:jobType/:category" element={<FacetJobs mode="combo" />} />
              <Route path="/jobs/country/:countryCode" element={<CountryJobs />} />
              <Route path="/jobs/:location" element={<LocationJobs />} />
              <Route path="/job/:jobId" element={<JobDetail />} />
              <Route path="/sitemap.xml" element={<SitemapRedirect />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/company/:slug" element={<CompanyDetail />} />
              <Route path="/waiting-list/:countryCode" element={<WaitingList />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/job-matcher" element={<JobMatcher />} />
              <Route path="/jobseekers" element={<Jobseekers />} />
              <Route path="/jobseekers/:id" element={<JobseekerDetail />} />
              <Route path="/knowledge-hub" element={<KnowledgeHub />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/upskilling" element={<UpskillingProgram />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/data-rights" element={<DataRights />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/listing-policy" element={<ListingPolicy />} />
              <Route path="/trust-safety" element={<TrustSafety />} />
              <Route path="/professional-profiles" element={<ProfessionalProfiles />} />
              <Route path="/professional-profiles/page/:pageNum" element={<ProfessionalProfiles />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="scraper" element={<AdminScraper />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </CookieConsentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
