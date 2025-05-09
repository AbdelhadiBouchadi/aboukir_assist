'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Response } from '@prisma/client';

interface Patient {
  id: string;
  name: string | null;
  phoneNumber: string;
}

interface ConversationType {
  id: string;
  patientId: string;
  patient: Patient;
  messageContent: string;
  responses: Response[];
  timestamp: Date;
  matched: boolean;
  similarity: number | null;
}

interface GroupedConversations {
  [patientId: string]: {
    patient: Patient;
    lastMessage: ConversationType;
    totalMessages: number;
  };
}

export function ConversationList({ data }: { data: ConversationType[] }) {
  // Group conversations by patient
  const groupedConversations = data.reduce<GroupedConversations>(
    (acc, conv) => {
      if (!acc[conv.patientId]) {
        acc[conv.patientId] = {
          patient: conv.patient,
          lastMessage: conv,
          totalMessages: 1,
        };
      } else {
        if (conv.timestamp > acc[conv.patientId].lastMessage.timestamp) {
          acc[conv.patientId].lastMessage = conv;
        }
        acc[conv.patientId].totalMessages++;
      }
      return acc;
    },
    {}
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-6 py-4"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Dernier message</TableHead>
            <TableHead>Total messages</TableHead>
            <TableHead>Dernier contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(groupedConversations).map(
            ({ patient, lastMessage, totalMessages }) => (
              <motion.tr
                key={patient.id}
                variants={item}
                className="border-b border-border"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {patient.name || 'Patient'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{patient.phoneNumber}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {lastMessage.messageContent}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{totalMessages}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(lastMessage.timestamp, {
                    addSuffix: true,
                    locale: fr,
                  })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/conversations/${patient.id}`}>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </motion.tr>
            )
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
