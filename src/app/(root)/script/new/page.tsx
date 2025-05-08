import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScriptForm } from '../ScriptForm';

export default function NewScriptPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un script</h1>
        <p className="text-muted-foreground">
          Créez une nouvelle paire question/réponse pour le système automatisé.
        </p>
      </div>

      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Informations sur le script</CardTitle>
          <CardDescription>
            Saisissez la question et la réponse en arabe et en français. Ajoutez
            des mots-clés pertinents pour améliorer la correspondance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScriptForm />
        </CardContent>
      </Card>
    </div>
  );
}
