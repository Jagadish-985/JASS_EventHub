
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-7xl animate-in fade-in-50">
      <PageHeader
        title="Settings"
        description="Manage your application preferences."
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control how you receive notifications from EventHub+.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about event recommendations and reminders.
              </p>
            </div>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get push notifications on your devices for real-time updates.
              </p>
            </div>
            <Switch id="push-notifications" disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
