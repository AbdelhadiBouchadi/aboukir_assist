import DashboardLayout from '@/components/shared/Layouts/DashboardLayout';
import { requireAuth } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  // const settings = await getSettings();

  // For demo purposes, use example data
  const settings = {
    id: '1',
    welcomeMessageAr: 'مرحبا بك في عيادة الأسنان. كيف يمكنني مساعدتك؟',
    welcomeMessageFr:
      'Bienvenue à la clinique dentaire. Comment puis-je vous aider?',
    matchThreshold: 0.7,
    autoReplyEnabled: true,
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your WhatsApp automation system settings.
        </p>
      </div>

      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure welcome messages, match threshold, and other system
            parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm defaultValues={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
