import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StatementBand } from "@/components/sections/StatementBand";
import { Comparison } from "@/components/sections/Comparison";
import { TransitionHeading } from "@/components/sections/TransitionHeading";
import { MediaKitPreview } from "@/components/sections/MediaKitPreview";
import { ProofBand } from "@/components/sections/ProofBand";
import { Features } from "@/components/sections/Features";
import { Results } from "@/components/sections/Results";
import { Pricing } from "@/components/sections/Pricing";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { AnimateSection } from "@/components/ui/animate-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <AnimateSection>
          <Hero />
        </AnimateSection>
        <AnimateSection>
          <StatementBand />
        </AnimateSection>
        <AnimateSection>
          <Comparison />
        </AnimateSection>
        <AnimateSection>
          <TransitionHeading />
        </AnimateSection>
        <AnimateSection>
          <MediaKitPreview />
        </AnimateSection>
        <AnimateSection>
          <ProofBand />
        </AnimateSection>
        <AnimateSection>
          <Features />
        </AnimateSection>
        <AnimateSection>
          <Results />
        </AnimateSection>
        <AnimateSection>
          <Pricing />
        </AnimateSection>
        <AnimateSection>
          <FinalCTA />
        </AnimateSection>
      </main>
    </>
  );
}
