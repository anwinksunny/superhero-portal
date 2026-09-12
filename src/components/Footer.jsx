import heroConfig from "@/lib/heroConfig";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-horizon-primary">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-horizon-accent/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-28 md:pb-10">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-horizon-accent to-horizon-accent-secondary text-horizon-primary font-bold text-lg">
            C
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