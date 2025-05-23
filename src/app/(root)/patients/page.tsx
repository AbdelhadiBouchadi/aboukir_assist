import { Suspense } from 'react';
import { PatientList } from './PatientsList';
import { getPatients } from '@/lib/actions';
import { demoPatientData } from '@/lib/data';
import { ConversationsLoading } from '@/components/shared/Conversations/ConversationsLoading';

export default async function PatientsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Gérez et visualisez toutes les interactions avec les patients et
            l’historique des conversations.
          </p>
        </div>
      </div>

      <Suspense fallback={<ConversationsLoading />}>
        <PatientListWrapper />
      </Suspense>
    </div>
  );
}

async function PatientListWrapper() {
  const patientData = await getPatients();
  return <PatientList data={patientData} />;
}
