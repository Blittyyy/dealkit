import Image from "next/image";

export function PhonePreview({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-[360px] ${className}`}>
      {/* SCREEN CONTENT (behind the frame — mockup needs transparent screen) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[78%] h-[82%] rounded-[28px] overflow-hidden bg-neutral-200"
      >
        <Image
          src="/auth-screen.png"
          alt="UGC creator with performance metrics"
          fill
          className="object-cover"
          sizes="360px"
          priority
        />
      </div>

      {/* PHONE FRAME (on top) */}
      <Image
        src="/auth-phone-mockup.png"
        alt="Phone frame"
        width={720}
        height={1440}
        className="relative h-auto w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.18)]"
        sizes="360px"
        priority
      />
    </div>
  );
}
