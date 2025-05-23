'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Patient } from '@prisma/client';
import { formatLanguage, getInitials } from '@/lib/utils';

interface Conversation {
  id: string;
  patient: Patient;
  messageContent: string;
  language?: 'ARABIC' | 'FRENCH';
  matched: boolean;
  timestamp: Date;
}

interface RecentConversationsProps {
  conversations: Conversation[];
}

export function RecentConversations({
  conversations,
}: RecentConversationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Conversations Récentes</CardTitle>
          <CardDescription>
            Derniers messages des patients sur tous les canaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Langue</TableHead>
                <TableHead>Correspondance</TableHead>
                <TableHead>Temps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(conversation.patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {conversation.patient.name || 'Patient'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          +{conversation.patient.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {conversation.messageContent}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        conversation.language === 'ARABIC'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs w-20 flex items-center justify-center"
                    >
                      {formatLanguage(conversation.patient.language)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {conversation.matched ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(conversation.timestamp, {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
