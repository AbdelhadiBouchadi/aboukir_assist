'use client';

import { getScript } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Script } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';
import { ScriptForm } from '../ScriptForm';

export default function UpdateScriptPage({
  params,
}: {
  params: { id: string };
}) {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScript() {
      try {
        const data = await getScript(params.id);
        setScript(data);
      } catch (error) {
        console.error('Error loading script:', error);
      } finally {
        setLoading(false);
      }
    }

    loadScript();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!script) {
    return <div>Script not found</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Modifier le script
        </h1>
        <p className="text-muted-foreground">
          Modifier la paire question/réponse existante.
        </p>
      </div>

      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Informations sur le script</CardTitle>
          <CardDescription>
            Mettre à jour la question et la réponse en arabe et en français.
            Modifier les mots-clés pour améliorer la correspondance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScriptForm defaultValues={script} />
        </CardContent>
      </Card>
    </div>
  );
}
