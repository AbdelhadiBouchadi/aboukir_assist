import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SettingsForm } from './SettingsForm';
import { getSettings } from '@/lib/actions';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre système d’automatisation WhatsApp.
        </p>
      </div>

      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Paramètres du système</CardTitle>
          <CardDescription>
            Configurez les messages de bienvenue, le seuil de correspondance et
            d’autres paramètres système.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm defaultValues={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
