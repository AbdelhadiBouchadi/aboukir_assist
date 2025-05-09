import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConversationList } from './ConversationsList';
import { ConversationsLoading } from '@/components/shared/Conversations/ConversationsLoading';
import { getConversations } from '@/lib/actions';

export default function ConversationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Affichez et gérez toutes les conversations des patients via WhatsApp.
        </p>
      </div>

      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Conversations Récentes</CardTitle>
          <CardDescription>
            Une liste de toutes les conversations récentes des patients avec le
            système.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<ConversationsLoading />}>
            <ConversationListWrapper />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function ConversationListWrapper() {
  const conversations = await getConversations();

  return <ConversationList data={conversations} />;
}
