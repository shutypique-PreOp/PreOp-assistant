import { SiteHeader } from "@/components/SiteHeader";
import { ConsultationWorkspace } from "@/components/ConsultationWorkspace";
import { DEMO_CASE_TEMPLATES } from "@/lib/cases";

export function generateStaticParams() {
  return DEMO_CASE_TEMPLATES.map((c) => ({ caseId: c.id }));
}

export default async function ConsultationCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;

  return (
    <>
      <SiteHeader compact />
      <main className="main-pad">
        <ConsultationWorkspace caseId={caseId} />
      </main>
    </>
  );
}
