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
import { Eye, CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Patient {
  id?: string;
  name: string;
  phoneNumber: string;
}

interface ConversationType {
  id: string;
  patientId?: string;
  patient: Patient;
  scriptId?: string | null;
  messageContent: string;
  response: string;
  timestamp: Date;
  matched: boolean;
  similarity: number | null;
}

export function ConversationList({ data }: { data: ConversationType[] }) {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);

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
            <TableHead>Message</TableHead>
            <TableHead>Response</TableHead>
            <TableHead>Match</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((conversation) => (
            <motion.tr
              key={conversation.id}
              variants={item}
              className="border-b border-border"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {conversation.patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {conversation.patient.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {conversation.patient.phoneNumber}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate">
                  {conversation.messageContent}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate">
                  {conversation.response}
                </div>
              </TableCell>
              <TableCell>
                {conversation.matched ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>
                      {Math.round((conversation.similarity || 0) * 100)}%
                    </span>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    <span>
                      {Math.round((conversation.similarity || 0) * 100)}%
                    </span>
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(conversation.timestamp, {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Conversation Details
                      </DialogTitle>
                      <DialogDescription>
                        Full information about this conversation.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedConversation && (
                      <div className="space-y-6 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {selectedConversation.patient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {selectedConversation.patient.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedConversation.patient.phoneNumber}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            Patient Message
                          </h3>
                          <div className="bg-muted p-3 rounded-lg">
                            <p>{selectedConversation.messageContent}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(
                                selectedConversation.timestamp,
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            System Response
                          </h3>
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <p>{selectedConversation.response}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Match Details</h3>
                          <div className="flex items-center gap-2">
                            <span>Match Status:</span>
                            {selectedConversation.matched ? (
                              <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                Matched
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Not Matched</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Similarity Score:</span>
                            <Badge variant="outline">
                              {Math.round(
                                (selectedConversation.similarity || 0) * 100
                              )}
                              %
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
