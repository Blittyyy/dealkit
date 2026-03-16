import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: layered gradient — cinematic, premium (50%) */}
      <div
        className="flex-1 flex flex-col lg:min-h-screen relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.25), transparent 55%), linear-gradient(180deg, #0B1426 0%, #0F1C34 100%)",
        }}
      >
        <Link
          href="/"
          className="absolute top-8 left-8 z-10 font-semibold text-white text-lg tracking-tight hover:text-white/90 transition-colors"
        >
          DealKit
        </Link>
        <div className="flex-1 flex items-center justify-center px-6 py-6 lg:py-8 overflow-y-auto">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>

      {/* Right: UGC image (50%) with soft fade into dark panel */}
      <div className="hidden lg:block lg:flex-1 lg:min-h-screen relative bg-[#F2F3F5]">
        <Image
          src="/UGC-Auth.png"
          alt="UGC creator"
          fill
          className="object-cover object-center"
          sizes="50vw"
          priority
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-[120px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #0F1C34 0%, rgba(15,28,52,0.7) 50%, transparent 100%)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
