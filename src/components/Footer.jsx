import heroConfig from "@/lib/heroConfig";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-horizon-secondary">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-28 md:pb-8 text-center text-sm text-horizon-text-muted">
        <p className="font-semibold text-horizon-text-light">
          {heroConfig.name}
        </p>
        <p className="mt-1">Clarion is always listening.</p>
        <p className="mt-3">&copy; {year} {heroConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}