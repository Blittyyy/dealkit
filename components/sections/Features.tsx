import { Card, CardContent } from "@/components/ui/card";
import { FileStack, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: FileStack,
    title: "Dynamic Media Kits",
    description: "Professional, branded landing pages that showcase your performance and rates in one place.",
    tint: false,
  },
  {
    icon: BarChart3,
    title: "Verified Analytics Integration",
    description: "Pull real CTR, retention, and ROAS from your platforms so brands see verified proof.",
    tint: true,
  },
  {
    icon: Users,
    title: "CRM for Creators",
    description: "Track brand conversations and deals so you never lose a follow-up.",
    tint: false,
  },
];

export function Features() {
  return (
    <section className="bg-base py-[4.5rem]" id="product">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Everything you need to command higher rates.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card
              key={f.title}
              className={`border-border-soft shadow-sm transition-interactive hover:-translate-y-0.5 hover:shadow-md hover:border-brand/50 ${
                f.tint ? "bg-brand/[0.06] border-brand/20" : "bg-white"
              }`}
            >
              <CardContent className="p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-border-soft/60 text-primary mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-primary mb-2 text-[1.05rem]">{f.title}</h3>
                <p className="text-sm leading-relaxed opacity-90" style={{ color: "#6B7280" }}>
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
