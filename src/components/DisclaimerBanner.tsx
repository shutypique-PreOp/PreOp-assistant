import { DISCLAIMER } from "@/lib/copy";

export function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner" role="status">
      <span className="disclaimer-dot" aria-hidden />
      {DISCLAIMER}
    </div>
  );
}
