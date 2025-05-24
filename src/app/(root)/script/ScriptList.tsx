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
import { Edit, Trash2, Eye, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Script } from '@prisma/client';
import { DeleteScript } from './DeleteScript';

interface ScriptListProps {
  data: Script[];
}

export function ScriptList({ data }: ScriptListProps) {
  const [viewItem, setViewItem] = useState<Script | null>(null);

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
                <TableHead>Question (Arabe)</TableHead>
                <TableHead>Question (Français)</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.questionAr}
                  </TableCell>
                  <TableCell>{item.questionFr}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.active ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">
                        <Check className="h-3 w-3 mr-1" />
                        Activé
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="h-3 w-3 mr-1" />
                        Désactivé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setViewItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>Détails du script</DialogTitle>
                            <DialogDescription>
                              Informations complètes pour cette paire de
                              questions et réponses.
                            </DialogDescription>
                          </DialogHeader>
                          {viewItem && (
                            <div className="space-y-6 py-4">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                  Question en arabe
                                </h3>
                                <p className="text-sm" dir="rtl">
                                  {viewItem.questionAr}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                  Question en français
                                </h3>
                                <p className="text-sm">{viewItem.questionFr}</p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                  Response en arabe
                                </h3>
                                <p className="text-sm" dir="rtl">
                                  {viewItem.responseAr}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                  Response en français
                                </h3>
                                <p className="text-sm">{viewItem.responseFr}</p>
                              </div>
                              {viewItem.keywords.length > 0 && (
                                <div className="space-y-2">
                                  <h3 className="text-sm font-medium">
                                    Mots clés
                                  </h3>
                                  <div className="flex flex-wrap gap-1">
                                    {viewItem.keywords.map((keyword, index) => (
                                      <Badge key={index} variant="secondary">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                  Categorie
                                </h3>
                                <Badge variant="outline">
                                  {viewItem.category}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Statut</h3>
                                {viewItem.active ? (
                                  <Badge className="bg-emerald-500 hover:bg-emerald-600">
                                    Activé
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Désactivé</Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/script/${item.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteScript scriptId={item.id} />
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
