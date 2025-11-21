'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Image from 'next/image';
import { FirestorePermissionError, errorEmitter } from '@/firebase';

const mockRoiData = [
  { name: 'Registrations', value: 1250 },
  { name: 'Attendance', value: 980 },
  { name: 'Engagement', value: 75 },
];

const mockSkillData = [
  { name: 'AI/ML', supply: 40, demand: 80 },
  { name: 'Cybersecurity', supply: 20, demand: 90 },
  { name: 'Cloud Computing', supply: 30, demand: 75 },
  { name: 'Web Dev', supply: 70, demand: 60 },
  { name: 'Design', supply: 60, demand: 50 },
];

export default function AdminPanelPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <PageHeader
        title="Admin Panel"
        description="Oversee university event metrics and validate certificates."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Event ROI Dashboard</CardTitle>
            <CardDescription>Mock metrics for event performance.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-3">
            {mockRoiData.map(item => (
              <div key={item.name} className="flex flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
                <div className="text-4xl font-bold text-primary">{item.name === 'Engagement' ? `${item.value}%` : item.value}</div>
                <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Student interest (Demand) vs. Events available (Supply)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={mockSkillData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demand" fill="#4F46E5" name="Student Demand" />
                  <Bar dataKey="supply" fill="#06B6D4" name="Event Supply" />
                </BarChart>
              </ResponsiveContainer>
            </div>
             <p className="mt-2 text-center text-sm text-red-500 font-semibold">Insight: Gap in AI & Cybersecurity offerings.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Certificate Validation</CardTitle>
            <CardDescription>Enter a Certificate ID to verify its integrity.</CardDescription>
          </CardHeader>
          <CardContent>
            <CertificateValidator />
          </CardContent>
        </Card>

      </div>
       <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader>
              <CardTitle>Event Heatmap</CardTitle>
              <CardDescription>Static mock of event locations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <Image src="https://picsum.photos/seed/admin-map/600/400" alt="Event Heatmap" width={600} height={400} className="object-cover" data-ai-hint="map background" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle>Event Insights from Timetable</CardTitle>
              <CardDescription>Sections with high availability for event scheduling.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Based on the timetable data, the following sections have the most free slots:</p>
                 <ul className="mt-4 list-disc space-y-2 pl-5 font-semibold">
                    <li>CSE-A</li>
                    <li>ECE-A</li>
                 </ul>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}

function CertificateValidator() {
  const [certId, setCertId] = useState('');
  const [result, setResult] = useState<{ id: string; hash: string } | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { firestore } = useFirebase();

  const handleValidate = async () => {
    if (!certId || !firestore) return;
    setIsLoading(true);
    setResult(null);
    setError('');

    const certRef = doc(firestore, 'certificates', certId);
    
    // Using getDoc with proper error handling
    try {
      const certSnap = await getDoc(certRef);
       if (certSnap.exists()) {
        const data = certSnap.data();
        setResult({ id: certSnap.id, hash: data.hash });
      } else {
        setError('Certificate not found.');
      }
    } catch (e) {
        const permissionError = new FirestorePermissionError({
          path: certRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError('An error occurred while validating.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Enter Certificate ID (UUID)"
          disabled={isLoading}
        />
        <Button onClick={handleValidate} disabled={isLoading || !certId}>
          Validate
        </Button>
      </div>
      {isLoading && <p>Validating...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-semibold text-green-600">
            ✅ Certificate Valid
          </p>
          <p className="text-xs">
            <span className="font-medium">ID:</span> {result.id}
          </p>
          <p className="text-xs break-all">
            <span className="font-medium">Hash:</span> {result.hash}
          </p>
        </div>
      )}
    </div>
  );
}
