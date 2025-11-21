import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="animate-in fade-in-50 flex flex-col items-center justify-center h-full">
      <div className="max-w-md w-full text-center">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit">
              <QrCode className="h-12 w-12" />
            </div>
            <CardTitle className="mt-4 font-headline text-2xl">Event Check-in</CardTitle>
            <CardDescription>
              Scan the event's QR code to mark your attendance. Your camera will be activated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full">
              <QrCode className="mr-2 h-5 w-5" />
              Scan QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
