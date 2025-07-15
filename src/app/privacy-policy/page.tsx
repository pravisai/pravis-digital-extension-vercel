
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <FadeIn>
      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="text-center">
            <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">Privacy Policy for Pravis</h1>
            <p className="mt-2 text-muted-foreground">Effective Date: July 7, 2025</p>
            <p className="text-sm text-muted-foreground">Last Updated: July 7, 2025</p>
          </header>

          <div className="space-y-8 text-base leading-relaxed text-foreground/80">
            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">1. Introduction</h2>
              <p>
                At Pravis, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our web application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">2. Information We Collect</h2>
              <p>
                When you sign in to Pravis using your Google account, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your name and email address (via Google Sign-In)</li>
                <li>
                  Gmail data only if you grant permission, including:
                  <ul className="list-circle pl-6 mt-1 space-y-1">
                    <li>Viewing a list of your recent emails</li>
                    <li>Creating and sending emails using your Gmail account</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-2">
                We never access your password or store sensitive data beyond what is necessary for the app to function.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Log you in securely using Google Authentication</li>
                <li>Provide access to Gmail functionality within the app</li>
                <li>Help you draft, send, and organize emails directly inside Pravis</li>
                <li>Improve and personalize your experience with our service</li>
              </ul>
              <p className="mt-2">
                We do not sell, rent, or share your data with third parties without your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">4. Data Security</h2>
              <p>
                We rely on trusted services like Firebase Authentication and Google APIs to ensure your data is secure. Any access tokens we use are stored safely and never exposed to unauthorized users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">5. User Consent</h2>
              <p>
                Before accessing any Gmail data, we present a clear Google consent screen where you can review and approve specific permissions. You may revoke access anytime through your Google Account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">6. Third-Party Services</h2>
              <p>
                Pravis integrates with third-party tools to provide its core functionality. These include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Firebase (for authentication and secure data handling)</li>
                  <li>Google APIs, including:
                      <ul className="list-circle pl-6 mt-1 space-y-1">
                          <li>Gmail API for email features</li>
                          <li>Google People API for retrieving your basic profile info</li>
                      </ul>
                  </li>
              </ul>
              <p className="mt-2">These services operate under their own privacy policies:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">7. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request that we delete your account and associated data</li>
                <li>Revoke permissions at any time via your Google Account</li>
                <li>Contact us with any concerns about how your data is handled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-headline mt-8 mb-4 text-foreground">8. Contact Us</h2>
              <p>
                If you have questions about this policy or how we handle your data, please reach out:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><span className="font-semibold">Email:</span> <a href="mailto:bodybusinessbiology2@gmail.com" className="text-primary hover:underline">bodybusinessbiology2@gmail.com</a></li>
                <li><span className="font-semibold">Website:</span> <a href="https://pravis-your-digital-extension.web.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://pravis-your-digital-extension.web.app</a></li>
              </ul>
            </section>
          </div>

          <div className="text-center pt-8">
            <Button asChild>
                <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
