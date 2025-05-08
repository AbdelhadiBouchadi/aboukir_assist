import { Suspense } from 'react';
import { ScriptList } from './ScriptList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getScripts } from '@/lib/actions';
import { ScriptsLoading } from '@/components/shared/Scripts/ScriptLoading';

export default async function ScriptPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Script de réponses
          </h1>
          <p className="text-muted-foreground">
            Gérez les paires de questions et de réponses pour les réponses
            WhatsApp automatisées.
          </p>
        </div>
        <Link href="/script/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un script
          </Button>
        </Link>
      </div>

      <Suspense fallback={<ScriptsLoading />}>
        <ScriptListWrapper />
      </Suspense>
    </div>
  );
}

async function ScriptListWrapper() {
  const scriptData = await getScripts();

  return <ScriptList data={scriptData} />;
}
