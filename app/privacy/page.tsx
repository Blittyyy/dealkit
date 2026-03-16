import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";

export const metadata = {
  title: "Privacy Policy — DealKit",
  description: "Privacy Policy for DealKit.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-base min-h-screen">
        <article className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted">Last updated: February 2025</p>

          <div className="mt-10 space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">1. Information We Collect</h2>
              <p className="text-muted leading-relaxed mb-3">
                We collect information you provide when you create an account, use the Service, or contact us.
                This may include your name, email address, payment information, and content you upload (such as
                performance metrics and media kit data).
              </p>
              <p className="text-muted leading-relaxed">
                We automatically collect certain technical data, including IP address, browser type, and usage
                data, to operate and improve the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">2. How We Use Your Information</h2>
              <p className="text-muted leading-relaxed">
                We use your information to provide, maintain, and improve DealKit; to process payments; to
                communicate with you about the Service; and to comply with legal obligations. We do not sell
                your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">3. Data Sharing</h2>
              <p className="text-muted leading-relaxed">
                We may share your information with service providers who assist us in operating the Service
                (e.g., hosting, analytics, payment processing). We require these providers to protect your data
                and use it only for the purposes we specify. We may also disclose information when required by
                law or to protect our rights and safety.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">4. Data Security</h2>
              <p className="text-muted leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, or destruction. No method of transmission
                over the internet is 100% secure; we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">5. Your Rights</h2>
              <p className="text-muted leading-relaxed">
                Depending on your location, you may have the right to access, correct, delete, or port your
                personal data, or to object to or restrict certain processing. To exercise these rights, contact
                us through the contact page. You may also unsubscribe from marketing emails at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">6. Cookies and Tracking</h2>
              <p className="text-muted leading-relaxed">
                We use cookies and similar technologies to maintain sessions, remember preferences, and
                analyze how the Service is used. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">7. Contact</h2>
              <p className="text-muted leading-relaxed">
                For privacy-related questions or requests, please visit our{" "}
                <Link href="/contact" className="text-brand hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-border-soft">
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
