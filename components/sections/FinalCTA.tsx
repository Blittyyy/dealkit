import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="bg-dark py-16" id="cta">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-[1.9rem] md:text-[2.25rem] lg:text-[2.5rem] font-bold text-white tracking-tight">
          Stop sending pitches that look like everyone else&apos;s.
        </h2>
        <p className="mt-5 text-white/65 max-w-xl mx-auto text-[0.95rem]">
          Command premium rates with clean, trusted performance proof.
        </p>
        <div className="mt-10">
          <Button
            variant="default"
            size="lg"
            className="transition-interactive hover:scale-[1.02] hover:shadow-md"
            asChild
          >
            <Link href="#cta">Start building your media kit</Link>
          </Button>
        </div>
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            <Link href="/terms" className="hover:text-white transition-colors duration-150">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors duration-150">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors duration-150">Contact</Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
