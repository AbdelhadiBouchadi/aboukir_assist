import { Conversation, Patient, Script } from '@prisma/client';

// New types for the enhanced bot functionality
export enum ConversationState {
  WELCOME = 'WELCOME',
  SERVICE_SELECTION = 'SERVICE_SELECTION',
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  GENERAL_CONVERSATION = 'GENERAL_CONVERSATION',
}

export interface ServiceOption {
  id: string;
  nameAr: string;
  nameFr: string;
  responseAr: string;
  responseFr: string;
}

export interface DentalService {
  id: string;
  nameAr: string;
  nameFr: string;
}

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
