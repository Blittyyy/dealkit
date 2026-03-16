import { Separator } from "@/components/ui/separator";

const metrics = [
  { value: "+32%", label: "HIGHER CLOSE RATE" },
  { value: "+18%", label: "FASTER BRAND RESPONSE" },
  { value: "4–5 FIGURE", label: "AVERAGE DEAL VALUE" },
];

export function Results() {
  return (
    <section className="bg-base py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-[2.1rem] md:text-[2.75rem] font-bold text-success leading-none">
                  {m.value}
                </p>
                <p className="text-[10px] md:text-[11px] text-muted uppercase tracking-wider mt-2">
                  {m.label}
                </p>
              </div>
              {i < metrics.length - 1 ? (
                <Separator
                  orientation="vertical"
                  className="hidden md:block h-14 bg-border-soft flex-shrink-0"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
