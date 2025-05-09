'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getPatientConversations, sendManualReply } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { getInitials } from '@/lib/utils';
import { Response } from '@prisma/client';

interface Message {
  id: string;
  messageContent: string;
  responses: Response[];
  timestamp: Date;
  matched: boolean;
}

interface Patient {
  id: string;
  name: string | null;
  phoneNumber: string;
  conversations: Message[];
}

export function PatientChat({ patient: initialPatient }: { patient: Patient }) {
  const [patient, setPatient] = useState(initialPatient);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Message[]>(
    initialPatient.conversations
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const newConversations = await getPatientConversations(patient.id);
      if (JSON.stringify(newConversations) !== JSON.stringify(conversations)) {
        setConversations(newConversations);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [patient.id, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const updatedConversation = await sendManualReply(patient.id, newMessage);

      // Update conversations with the new response
      setConversations((prev) => {
        const lastConversation = prev[prev.length - 1];
        const updatedPrev = [...prev.slice(0, -1)];

        return [
          ...updatedPrev,
          {
            ...lastConversation,
            responses: [
              ...(lastConversation.responses || []),
              {
                id: updatedConversation.id,
                conversationId: lastConversation.id,
                content: newMessage,
                isAutomatic: false,
                timestamp: new Date(),
              },
            ],
          },
        ];
      });

      toast.success('Message envoyé avec succès');
      setNewMessage('');
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{patient.name || 'Patient'}</h2>
            <p className="text-sm text-muted-foreground">
              +{patient.phoneNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversations.map((message) => (
          <div key={message.id} className="space-y-4">
            {/* Patient message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%]">
                <div className="rounded-lg bg-muted p-3">
                  <p>{message.messageContent}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </motion.div>

            {/* Responses */}
            {message.responses?.map((response) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 justify-end"
              >
                <div className="max-w-[80%]">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p>{response.content}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground text-right">
                    {response.isAutomatic
                      ? 'Réponse automatique'
                      : 'Réponse manuelle'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim()}
            className="self-end"
          >
            {isSending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
