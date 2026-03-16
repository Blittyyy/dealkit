import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";

export const metadata = {
  title: "Terms of Service — DealKit",
  description: "Terms of Service for DealKit.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-base min-h-screen">
        <article className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted">Last updated: February 2025</p>

          <div className="mt-10 space-y-10">
            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted leading-relaxed">
                By accessing or using DealKit (&quot;Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">2. Description of Service</h2>
              <p className="text-muted leading-relaxed">
                DealKit provides tools for creators to build and share performance-based media kits, including
                analytics integration, package presentation, and branded landing pages. We reserve the right to
                modify or discontinue the Service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">3. Account and Use</h2>
              <p className="text-muted leading-relaxed mb-3">
                You are responsible for maintaining the confidentiality of your account and for all activity
                under your account. You agree to use the Service only for lawful purposes and in accordance
                with these Terms.
              </p>
              <p className="text-muted leading-relaxed">
                You may not use the Service to misrepresent performance data, violate any third-party rights,
                or distribute content that is harmful, illegal, or otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">4. Payment and Billing</h2>
              <p className="text-muted leading-relaxed">
                Paid plans are billed in advance on a monthly or annual basis. You may cancel at any time;
                cancellation will take effect at the end of the current billing period. No refunds are provided
                for partial periods.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">5. Intellectual Property</h2>
              <p className="text-muted leading-relaxed">
                DealKit and its content, features, and functionality are owned by us and are protected by
                applicable intellectual property laws. You retain ownership of content you upload; you grant us
                a license to use it to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">6. Limitation of Liability</h2>
              <p className="text-muted leading-relaxed">
                The Service is provided &quot;as is.&quot; We are not liable for any indirect, incidental, special, or
                consequential damages arising from your use of the Service. Our total liability is limited to
                the amount you paid us in the twelve months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3">7. Contact</h2>
              <p className="text-muted leading-relaxed">
                Questions about these Terms? Contact us at{" "}
                <Link href="/contact" className="text-brand hover:underline">
                  our contact page
                </Link>
                .
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-border-soft">
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
