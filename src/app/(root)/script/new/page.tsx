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
        <h1 className="text-3xl font-bold tracking-tight">
          Add New Script Entry
        </h1>
        <p className="text-muted-foreground">
          Create a new question and response pair for the automated system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Script Information</CardTitle>
          <CardDescription>
            Enter the question and response in both Arabic and French. Add
            relevant keywords to improve matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScriptForm />
        </CardContent>
      </Card>
    </div>
  );
}
