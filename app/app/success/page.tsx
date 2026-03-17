import { Suspense } from "react";
import SuccessContent from "./success-content";

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

/** Server Component wrapper — useSearchParams lives only inside SuccessContent (client) + Suspense. */
export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
