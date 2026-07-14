import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/copy";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`site-header ${compact ? "site-header--compact" : ""}`}>
      <Link href="/" className="brand-mark">
        <span className="brand-mark__glyph" aria-hidden>
          ◈
        </span>
        <span className="brand-mark__name">{PRODUCT_NAME}</span>
      </Link>
      {compact && (
        <Link href="/consultation" className="header-link">
          Changer de dossier
        </Link>
      )}
    </header>
  );
}
