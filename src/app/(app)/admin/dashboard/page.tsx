'use client';
import { PageHeader } from '@/components/page-header';
import { useFirebase } from '@/firebase';

export default function AdminDashboardPage() {
  const { user } = useFirebase();

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title={`Admin Dashboard`}
        description={`Welcome, ${user?.displayName || 'Admin'}! Manage your university's events.`}
      />
      <div className="grid gap-6">
        {/* Admin specific components will go here */}
        <p>This is the admin dashboard. Content to be added.</p>
      </div>
    </div>
  );
}
