'use client';
import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const sha256 = async (message: string) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    const qrCodeScanner = new Html5Qrcode('qr-reader-container');
    scannerRef.current = qrCodeScanner;

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      if (!scanResult) {
        setScanResult(decodedText);
        handleCheckIn(decodedText);
         if (scannerRef.current?.isScanning) {
          scannerRef.current.stop();
        }
      }
    };

    const onScanFailure = (error: any) => {
      // console.warn(`QR error = ${error}`);
    };
    
    qrCodeScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        },
        onScanSuccess,
        onScanFailure
      )
      .catch((err) => {
        // console.error("Unable to start scanning.", err)
      });
      
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(err => console.log('Failed to stop scanner'));
      }
    };
  }, [scanResult]);


  const handleCheckIn = async (eventId: string) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }

    // 1. Mark attendance
    const attendanceRef = collection(firestore, 'attendance');
    addDocumentNonBlocking(attendanceRef, {
      eventId: eventId,
      userId: user.uid,
      present: true,
      timestamp: new Date().toISOString(),
    });

    // 2. Generate certificate metadata
    const certId = uuidv4();
    const certHash = await sha256(`${eventId}-${user.uid}-${certId}`);
    const certificateRef = collection(firestore, 'certificates');
    addDocumentNonBlocking(certificateRef, {
      uuid: certId, // Changed from id to uuid
      hash: certHash,
      eventId: eventId,
      userId: user.uid,
      issueDate: new Date().toISOString(),
    });

    toast({
      title: 'Check-in Successful!',
      description: `Attendance marked for event. Certificate issued.`,
    });
  };

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="QR Code Scanner"
        description="Scan an event QR code to mark your attendance."
      />
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div id="qr-reader-container" className="w-full"></div>
          {scanResult && (
            <div className="mt-4 text-center">
              <p className="font-semibold text-green-600">Scan Successful!</p>
              <p className="text-muted-foreground text-sm">Event ID: {scanResult}</p>
              <p className="text-muted-foreground">Processing your check-in...</p>
            </div>
          )}
           {!hasCameraPermission && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
