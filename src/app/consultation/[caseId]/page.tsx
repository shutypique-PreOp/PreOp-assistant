import { SiteHeader } from "@/components/SiteHeader";
import { ConsultationWorkspace } from "@/components/ConsultationWorkspace";

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
