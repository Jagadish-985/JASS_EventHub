'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { useFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    let isScanning = true;

    const onScanSuccess = async (decodedText: string, decodedResult: any) => {
      if (isScanning) {
        isScanning = false; // Prevent multiple executions
        setScanResult(decodedText);
        scanner.stop().catch(err => console.error("Error stopping scanner", err));

        if (!user) {
          toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
          return;
        }

        try {
          // 1. Mark attendance
          const attendanceRef = collection(firestore, 'attendance');
          await addDoc(attendanceRef, {
            eventId: decodedText,
            userId: user.uid,
            present: true,
            timestamp: new Date().toISOString(),
          });

          // 2. Generate certificate metadata
          const certId = uuidv4();
          const certHash = await sha256(`${decodedText}-${user.uid}-${certId}`);
          const certificateRef = collection(firestore, 'certificates');
          await addDoc(certificateRef, {
            id: certId,
            hash: certHash,
            eventId: decodedText,
            userId: user.uid,
            issueDate: new Date().toISOString(),
          });

          toast({
            title: 'Check-in Successful!',
            description: `Attendance marked for event. Certificate issued.`,
          });

        } catch (error) {
          console.error("Error during check-in:", error);
          toast({
            variant: 'destructive',
            title: 'Check-in Failed',
            description: 'There was a problem recording your attendance.',
          });
        }
      }
    };

    const onScanFailure = (error: any) => {
      // console.warn(`Code scan error = ${error}`);
    };

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      console.error("Unable to start scanning.", err);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not start camera. Please check permissions."
      });
    });

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(err => console.error("Error stopping scanner on cleanup", err));
      }
    };
  }, [user, firestore, toast]);

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
          <div id="qr-reader" className="w-full"></div>
          {scanResult && (
            <div className="mt-4 text-center">
              <p className="font-semibold text-green-600">Scan Successful!</p>
              <p className="text-muted-foreground text-sm">Event ID: {scanResult}</p>
              <p className="text-muted-foreground">Processing your check-in...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
