import { Suspense } from "react";
import { KitCreatedSuccessContent } from "./kit-created-success-content";

function SuccessFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.15), transparent 50%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
      }}
    >
      <p className="text-sm text-muted">Loading…</p>
    </div>
  );
}

export default function KitCreatedSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <KitCreatedSuccessContent />
    </Suspense>
  );
}
