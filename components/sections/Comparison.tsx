import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function Comparison() {
  return (
    <section className="bg-base py-[4.5rem]" id="how">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-[1.65rem] md:text-[2rem] lg:text-[2.1rem] font-bold text-primary text-center max-w-2xl mx-auto tracking-tight">
          Most creators lose deals because their pitch lacks structured proof.
        </h2>
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <Card className="border-[#E6E8EC] border shadow-[0_1px_2px_rgba(0,0,0,0.04)] bg-[#F2F3F5] transition-interactive hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-6">
              <Badge variant="muted" className="mb-4 rounded-[9999px] bg-[#FEE2E2]/50 text-[#991B1B] border-[#FECACA]">
                TYPICAL CREATOR PITCH
              </Badge>
              <ul className="space-y-3 text-sm" style={{ color: "#6B7280" }}>
                <li className="flex items-start gap-2">• Fragmented Canva decks</li>
                <li className="flex items-start gap-2">• Scattered Google Drive links</li>
                <li className="flex items-start gap-2">• Unverified performance claims</li>
                <li className="flex items-start gap-2">• No structured metrics brands trust</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-brand border-2 shadow-[0_4px_12px_rgba(59,111,255,0.08)] bg-white transition-interactive hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="p-7">
              <Badge variant="brand" className="mb-4 rounded-[9999px] font-semibold">
                DEALKIT PERFORMANCE KIT
              </Badge>
              <ul className="space-y-3 text-primary text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.5} />
                  Professional, branded landing media kit
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.5} />
                  Verified performance metrics (CTR/retention/ROAS)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.5} />
                  Structured pricing that justifies premium rates
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" strokeWidth={2.5} />
                  Clear &quot;proof&quot; section brands understand
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
