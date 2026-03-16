import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact — DealKit",
  description: "Get in touch with DealKit.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-base min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
            Contact us
          </h1>
          <p className="mt-2 text-muted max-w-xl">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <section className="rounded-[12px] border border-border-soft bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-border-soft/60">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-primary">Email</h2>
              </div>
              <p className="text-muted text-sm mb-4">
                For general inquiries, support, or partnership opportunities.
              </p>
              <a
                href="mailto:hello@dealkit.com"
                className="text-brand font-medium hover:underline"
              >
                hello@dealkit.com
              </a>
            </section>

            <section className="rounded-[12px] border border-border-soft bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-border-soft/60">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-primary">Support</h2>
              </div>
              <p className="text-muted text-sm mb-4">
                Existing customers can reach support for account or technical help.
              </p>
              <a
                href="mailto:support@dealkit.com"
                className="text-brand font-medium hover:underline"
              >
                support@dealkit.com
              </a>
            </section>
          </div>

          <div className="mt-12 rounded-[12px] border border-border-soft bg-white p-6 shadow-sm max-w-xl">
            <h2 className="text-lg font-semibold text-primary mb-2">Response time</h2>
            <p className="text-muted text-sm">
              We aim to respond to all inquiries within 24 hours on business days.
            </p>
          </div>

          <div className="mt-12">
            <Button variant="default" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>

          <footer className="mt-16 pt-8 border-t border-border-soft">
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
