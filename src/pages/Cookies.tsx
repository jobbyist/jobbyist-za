import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cookie Policy | Jobbyist ZA"
        description="Learn about how Jobbyist uses cookies and similar technologies to provide, improve, and protect our services."
        canonicalUrl="https://za.jobbyist.africa/cookies"
      />
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>What Are Cookies?</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    Cookies are small text files that are placed on your device when you visit our website. 
                    They help us provide you with a better experience by remembering your preferences and 
                    understanding how you use our services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How We Use Cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="font-semibold">Essential Cookies</p>
                  <p>
                    These cookies are necessary for the website to function properly. They enable core 
                    functionality such as security, network management, and accessibility.
                  </p>
                  
                  <p className="font-semibold mt-4">Analytics Cookies</p>
                  <p>
                    We use analytics cookies to understand how visitors interact with our website. This 
                    information helps us improve our services and user experience.
                  </p>
                  
                  <p className="font-semibold mt-4">Functional Cookies</p>
                  <p>
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your login details and preferences.
                  </p>
                  
                  <p className="font-semibold mt-4">Advertising Cookies</p>
                  <p>
                    We may use advertising cookies to show you relevant advertisements based on your 
                    interests and browsing behavior.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Managing Cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    You can control and manage cookies in various ways. Please note that removing or 
                    blocking cookies may impact your user experience and some features may no longer be 
                    available.
                  </p>
                  <p>
                    Most browsers automatically accept cookies, but you can modify your browser settings 
                    to decline cookies if you prefer. Please refer to your browser's help section for 
                    instructions on how to manage cookies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Third-Party Cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We may use third-party service providers who may also set cookies on your device to 
                    provide their services. These third parties have their own privacy policies and cookie 
                    policies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Updates to This Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    We may update this Cookie Policy from time to time to reflect changes in our practices 
                    or for other operational, legal, or regulatory reasons. Please check this page regularly 
                    to stay informed about our use of cookies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                  <p>
                    If you have any questions about our use of cookies, please contact us at{" "}
                    <a href="mailto:privacy@jobbyist.africa" className="text-primary hover:underline">
                      privacy@jobbyist.africa
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
