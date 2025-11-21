import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Certificate } from '@/lib/types';
import { Button } from './ui/button';
import { Download, Award } from 'lucide-react';

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <Card className="overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={certificate.image}
            alt={certificate.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint="abstract background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
            <h3 className="font-bold text-lg text-white font-headline">{certificate.title}</h3>
            <p className="text-sm text-white/80">From: {certificate.event}</p>
          </div>
        </div>
        <div className="p-4 bg-card flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Issued: {new Date(certificate.date).toLocaleDateString()}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5" />
            <span className="sr-only">Download Certificate</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
