import { Conversation, Patient, Script, Setting } from '@prisma/client';

export type PatientWithConversationCount = Patient & {
  _count: {
    conversations: number;
  };
};

export type PatientWithConversations = Patient & {
  conversations: (Conversation & {
    script: Script | null;
    responses: Response[];
  })[];
};

export type ConversationWithRelations = Conversation & {
  patient: Patient;
  script: Script | null;
  responses: Response[];
};

export type DashboardStats = {
  totalPatients: number;
  conversationsToday: number;
  responseRate: number;
  matchAccuracy: number;
};

export type MonthlyStats = {
  name: string;
  arabic: number;
  french: number;
};

export type ResponseDistribution = {
  name: string;
  value: number;
};
