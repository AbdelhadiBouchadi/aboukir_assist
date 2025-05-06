import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WhatsAppSetup } from './WhatsappSetup';

export default function WhatsAppPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          WhatsApp Integration
        </h1>
        <p className="text-muted-foreground">
          Connect and configure your WhatsApp Business API account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business API</CardTitle>
          <CardDescription>
            Connect your WhatsApp Business account to enable automated
            responses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WhatsAppSetup />
        </CardContent>
      </Card>
    </div>
  );
}
