import { PageHeader } from '@/components/page-header';
import { certificates } from '@/lib/data';
import { CertificateCard } from '@/components/certificate-card';

export default function CertificatesPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Certificate Vault"
        description="A secure place for all your event participation certificates."
      />

      {certificates.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No certificates yet</h3>
          <p className="text-muted-foreground mt-2">Attend events to start collecting certificates!</p>
        </div>
      )}
    </div>
  );
}
