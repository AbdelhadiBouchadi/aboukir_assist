'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Patient {
  id: string;
  phoneNumber: string;
  name: string | null;
  language: 'FRENCH' | 'ARABIC';
  lastInteracted: Date | null;
  _count: {
    conversations: number;
  };
}

interface PatientListProps {
  data: Patient[];
}

export function PatientList({ data }: PatientListProps) {
  const [viewItem, setViewItem] = useState<Patient | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/20">
        <CardContent className="px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Num. Tél</TableHead>
                <TableHead>Langue</TableHead>
                <TableHead>Dernière interaction</TableHead>
                <TableHead>Messages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {patient.name
                            ? patient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {patient.name || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{patient.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.language === 'ARABIC' ? 'default' : 'secondary'
                      }
                    >
                      {patient.language}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {patient.lastInteracted
                      ? formatDistanceToNow(patient.lastInteracted, {
                          addSuffix: true,
                        })
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{patient._count.conversations}</span>
                    </div>
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
