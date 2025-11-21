'use client';
import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AttendancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startScan = async () => {
    setIsScanning(true);
    setHasCameraPermission(null); // Reset permission state
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to scan QR codes.',
        });
        setIsScanning(false);
      }
    } else {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Your browser does not support camera access.',
      });
      setIsScanning(false);
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, []);

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Event Check-in"
        description="Scan the event's QR code to mark your attendance."
      />
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <Card className="shadow-xl">
            {!isScanning ? (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit">
                    <QrCode className="h-12 w-12" />
                  </div>
                  <CardTitle className="mt-4 font-headline text-2xl">Ready to Check In?</CardTitle>
                  <CardDescription>
                    Click the button below to activate your camera and scan the event QR code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="lg" className="w-full" onClick={startScan}>
                    <QrCode className="mr-2 h-5 w-5" />
                    Scan QR Code
                  </Button>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Scanning QR Code</CardTitle>
                  <CardDescription>Point your camera at the QR code.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  </div>
                  {hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to use this feature.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button size="lg" variant="outline" className="w-full" onClick={stopScan}>
                    Cancel
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
