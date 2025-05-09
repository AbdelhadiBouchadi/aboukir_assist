import { PatientChat } from '@/components/shared/Conversations/PatientChat';
import { getPatient } from '@/lib/actions';
import { notFound } from 'next/navigation';

export default async function PatientChatPage({
  params,
}: {
  params: { patientId: string };
}) {
  const patient = await getPatient(params.patientId);

  if (!patient) {
    notFound();
  }

  return <PatientChat patient={patient} />;
}
