import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function KitNotFound() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-primary tracking-tight">
          Kit not found
        </h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          This media kit doesn&apos;t exist or isn&apos;t available yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to DealKit</Link>
        </Button>
      </div>
    </div>
  );
}
