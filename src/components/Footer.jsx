import SmoothImage from "./SmoothImage";
import heroConfig from "@/lib/heroConfig";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-horizon-primary cv-auto">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-horizon-accent/40" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-28 md:pb-10">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden shadow-glow-sm hover:scale-105 transition-transform duration-200">
            <SmoothImage
              src="/logo.png"
              alt="Clarion Logo"
              width={48}
              height={48}
              quality={70}
              sizes="48px"
              wrapperClassName="h-full w-full"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="text-lg font-bold text-horizon-text-light">
            {heroConfig.name}
          </p>
          <p className="text-sm text-horizon-text-muted">
            Clarion is always listening.
          </p>

          {/* Divider */}
          <div className="w-16 h-[1px] bg-horizon-secondary my-2" />

          <p className="text-xs text-horizon-text-muted/60">
            &copy; {year} {heroConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}