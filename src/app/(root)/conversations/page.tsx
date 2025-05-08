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
  // In a real app, this would fetch from the database
  // const conversations = await getConversations();

  // For demo purposes, use example data
  const conversations = [
    {
      id: '1',
      patient: {
        name: 'Ahmed Hassan',
        phoneNumber: '+212612345678',
      },
      messageContent: 'مرحبا، هل يمكنني معرفة ساعات العمل؟',
      response:
        'ساعات عملنا هي من الاثنين إلى الجمعة من الساعة 9 صباحًا حتى 6 مساءً، والسبت من الساعة 10 صباحًا حتى 4 مساءً، والأحد مغلق.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      matched: true,
      similarity: 0.92,
    },
    {
      id: '2',
      patient: {
        name: 'Marie Dubois',
        phoneNumber: '+212698765432',
      },
      messageContent:
        'Bonjour, quels sont vos tarifs pour un nettoyage dentaire?',
      response:
        "Le coût d'un nettoyage dentaire de base commence à 80€. Le coût peut varier en fonction de vos besoins individuels. Veuillez nous appeler ou nous visiter pour plus d'informations.",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      matched: true,
      similarity: 0.88,
    },
    {
      id: '3',
      patient: {
        name: 'Fatima Amrani',
        phoneNumber: '+212633445566',
      },
      messageContent: 'هل يمكنني تحديد موعد لفحص أسناني؟',
      response: 'عذرًا، لم أفهم سؤالك. هل يمكنك إعادة صياغته؟',
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      matched: false,
      similarity: 0.65,
    },
    {
      id: '4',
      patient: {
        name: 'Jean Dupont',
        phoneNumber: '+212677889900',
      },
      messageContent: "Est-ce que vous acceptez l'assurance dentaire?",
      response:
        "Oui, nous acceptons la plupart des assurances dentaires. Veuillez apporter votre carte d'assurance lors de votre visite, et nous vérifierons votre couverture.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      matched: true,
      similarity: 0.85,
    },
    {
      id: '5',
      patient: {
        name: 'Youssef El Mansouri',
        phoneNumber: '+212611223344',
      },
      messageContent: 'أين تقع عيادتكم؟',
      response:
        "تقع عيادتنا في شارع الحسن الثاني، بجوار البنك الشعبي، الرباط. يمكنك العثور علينا على خرائط جوجل باسم 'عيادة أسنان الشفاء'.",
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      matched: true,
      similarity: 0.95,
    },
    {
      id: '6',
      patient: {
        name: 'Sophie Martin',
        phoneNumber: '+212644556677',
      },
      messageContent:
        'Combien de temps dure un rendez-vous pour un traitement de canal?',
      response:
        "Désolé, je n'ai pas compris votre question. Pouvez-vous la reformuler?",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      matched: false,
      similarity: 0.55,
    },
  ];

  return <ConversationList data={conversations} />;
}
