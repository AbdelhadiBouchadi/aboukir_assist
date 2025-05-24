'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendLanguageSelectionMessage, sendWhatsAppMessage } from './whatsapp';
import {
  ConversationState,
  DashboardStats,
  MonthlyStats,
  ResponseDistribution,
} from '../types';
import { cosineSimilarity, getEmbedding } from './openai';

// Script actions
export async function getScripts() {
  return await prisma.script.findMany({
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getScript(id: string) {
  return await prisma.script.findUnique({
    where: { id },
  });
}

export async function createScript(data: {
  questionAr: string;
  questionFr: string;
  responseAr: string;
  responseFr: string;
  keywords?: string[];
  category?: string;
  active?: boolean;
}) {
  // Generate embeddings for both languages
  const [embeddingAr, embeddingFr] = await Promise.all([
    getEmbedding(data.questionAr),
    getEmbedding(data.questionFr),
  ]);

  const script = await prisma.script.create({
    data: {
      questionAr: data.questionAr,
      questionFr: data.questionFr,
      responseAr: data.responseAr,
      responseFr: data.responseFr,
      keywords: data.keywords || [],
      category: data.category,
      active: data.active !== undefined ? data.active : true,
      embeddingAr: embeddingAr || [],
      embeddingFr: embeddingFr || [],
    },
  });

  revalidatePath('/script');
  return script;
}

export async function updateScript(
  id: string,
  data: {
    questionAr?: string;
    questionFr?: string;
    responseAr?: string;
    responseFr?: string;
    keywords?: string[];
    category?: string;
    active?: boolean;
  }
) {
  // Only generate new embeddings if questions are updated
  const embeddings: { embeddingAr?: number[]; embeddingFr?: number[] } = {};

  if (data.questionAr) {
    embeddings.embeddingAr = await getEmbedding(data.questionAr);
  }
  if (data.questionFr) {
    embeddings.embeddingFr = await getEmbedding(data.questionFr);
  }

  const script = await prisma.script.update({
    where: { id },
    data: {
      ...data,
      ...embeddings,
    },
  });

  revalidatePath('/script');
  return script;
}

export async function deleteScript(id: string) {
  await prisma.script.delete({
    where: { id },
  });

  revalidatePath('/script');
  return { success: true };
}

// Patient actions
export async function getPatients() {
  return await prisma.patient.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { conversations: true },
      },
    },
  });
}

export async function getPatient(id: string) {
  return await prisma.patient.findUnique({
    where: { id },
    include: {
      conversations: {
        orderBy: { timestamp: 'desc' },
        include: {
          script: true,
          responses: {
            orderBy: { timestamp: 'asc' },
          },
        },
      },
    },
  });
}

export async function createPatient(data: {
  phoneNumber: string;
  name?: string;
  language?: 'ARABIC' | 'FRENCH';
}) {
  const patient = await prisma.patient.create({
    data: {
      phoneNumber: data.phoneNumber,
      name: data.name,
      language: data.language || 'FRENCH',
      conversationState: ConversationState.WELCOME,
    },
  });

  revalidatePath('/patients');
  return patient;
}

export async function updatePatientLanguage(
  phoneNumber: string,
  language: 'ARABIC' | 'FRENCH',
  name?: string
) {
  const patient = await prisma.patient.findUnique({
    where: { phoneNumber },
  });

  if (!patient) {
    return await createPatient({
      phoneNumber,
      language,
      name,
    });
  }

  const updated = await prisma.patient.update({
    where: { id: patient.id },
    data: { language },
  });

  revalidatePath('/patients');
  return updated;
}

// New: Update patient conversation state
export async function updatePatientState(
  phoneNumber: string,
  state: ConversationState,
  lastServiceId?: string
) {
  const patient = await prisma.patient.findUnique({
    where: { phoneNumber },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  const updated = await prisma.patient.update({
    where: { id: patient.id },
    data: {
      conversationState: state,
      lastServiceId: lastServiceId || patient.lastServiceId,
    },
  });

  revalidatePath('/patients');
  return updated;
}

// New: Get patient by phone number, create if not exists
export async function getPatientById(phoneNumber: string, name?: string) {
  let patient = await prisma.patient.findUnique({
    where: { phoneNumber },
  });

  if (!patient) {
    patient = await createPatient({
      phoneNumber,
      name: name,
    });
  }

  return patient;
}

// New: Create a conversation with response
export async function createConversationWithResponse(
  patientId: string,
  messageContent: string,
  responseContent: string,
  isAutomatic: boolean = true
) {
  const conversation = await prisma.conversation.create({
    data: {
      patientId,
      scriptId: null,
      messageContent,
      matched: false,
      similarity: 0,
      responses: {
        create: {
          content: responseContent,
          isAutomatic,
        },
      },
    },
    include: {
      responses: true,
    },
  });

  // Update patient last interaction
  await prisma.patient.update({
    where: { id: patientId },
    data: {
      lastInteracted: new Date(),
    },
  });

  revalidatePath('/conversations');
  revalidatePath('/patients');

  return conversation;
}

// Conversation actions
export async function getConversations() {
  return await prisma.conversation.findMany({
    include: {
      patient: true,
      script: true,
      responses: {
        orderBy: { timestamp: 'asc' },
      },
    },
    orderBy: { timestamp: 'desc' },
  });
}

export async function getPatientLanguage(
  phoneNumber: string
): Promise<'ARABIC' | 'FRENCH' | null> {
  const patient = await prisma.patient.findUnique({
    where: { phoneNumber },
  });

  return patient?.language ?? null;
}

export async function processMessage(
  phoneNumber: string,
  message: string,
  language: 'ARABIC' | 'FRENCH' = 'FRENCH',
  name?: string
) {
  // Find or create patient
  let patient = await prisma.patient.findUnique({
    where: { phoneNumber },
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        phoneNumber,
        language,
        name: name || null,
        conversationState: ConversationState.WELCOME,
      },
    });

    // Get welcome message from settings
    const settings = await getSettings();

    // Create a placeholder conversation for the welcome message
    const conversation = await prisma.conversation.create({
      data: {
        patientId: patient.id,
        scriptId: null,
        messageContent: '[Initial contact]',
        matched: false,
        similarity: 0,
        responses: {
          create: {
            content: `${settings.welcomeMessageFr}\n\n${settings.welcomeMessageAr}`,
            isAutomatic: true,
          },
        },
      },
      include: {
        responses: true,
      },
    });

    // Send language selection message without creating another message
    await sendLanguageSelectionMessage(
      phoneNumber,
      `${settings.welcomeMessageFr}\n\n${settings.welcomeMessageAr}`
    );

    return {
      response: `${settings.welcomeMessageFr}\n\n${settings.welcomeMessageAr}`,
      matched: false,
      similarity: 0,
      conversation,
    };
  }

  // Use patient's stored language preference
  language = patient.language;
  const isArabic = language === 'ARABIC';

  // Get message embedding
  const messageEmbedding = await getEmbedding(message);
  if (!messageEmbedding) {
    throw new Error('Failed to generate message embedding');
  }

  // Find the best matching script
  const scripts = await prisma.script.findMany({
    where: { active: true },
  });

  let bestMatch = null;
  let bestScore = 0;

  for (const script of scripts) {
    const scriptEmbedding = isArabic ? script.embeddingAr : script.embeddingFr;

    // Skip if script doesn't have embeddings
    if (!scriptEmbedding || scriptEmbedding.length === 0) {
      console.warn(
        `Script ${script.id} missing ${isArabic ? 'Arabic' : 'French'} embedding`
      );
      continue;
    }

    const similarity = cosineSimilarity(messageEmbedding, scriptEmbedding);

    // Add keyword boost
    let keywordBoost = 0;
    if (script.keywords && script.keywords.length > 0) {
      const messageWords = message.toLowerCase().split(/\s+/);
      for (const keyword of script.keywords) {
        if (messageWords.includes(keyword.toLowerCase())) {
          keywordBoost += 0.1;
        }
      }
    }

    const totalScore = similarity + keywordBoost;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = script;
    }
  }

  // Get threshold from settings
  const settings = await getSettings();
  const threshold = settings.matchThreshold;

  // If we have a good match and auto-reply is enabled, use it
  const matched = bestScore >= threshold && settings.autoReplyEnabled;
  const responseContent = matched
    ? isArabic
      ? bestMatch!.responseAr
      : bestMatch!.responseFr
    : isArabic
      ? 'عذرًا، لم أفهم سؤالك. هل يمكنك إعادة صياغته؟'
      : "Désolé, je n'ai pas compris votre question. Pouvez-vous la reformuler?";

  // Record the conversation
  const conversation = await prisma.conversation.create({
    data: {
      patientId: patient.id,
      scriptId: matched ? bestMatch!.id : null,
      messageContent: message,
      matched,
      similarity: bestScore,
      responses: {
        create: {
          content: responseContent,
          isAutomatic: matched,
        },
      },
    },
    include: {
      responses: true,
    },
  });

  // Update patient last interaction and ensure they're in general conversation state
  await prisma.patient.update({
    where: { id: patient.id },
    data: {
      lastInteracted: new Date(),
      conversationState: ConversationState.GENERAL_CONVERSATION,
    },
  });

  revalidatePath('/conversations');
  revalidatePath('/patients');
  revalidatePath('/dashboard');

  // Send the response via WhatsApp
  await sendWhatsAppMessage(phoneNumber, responseContent);

  return {
    response: responseContent,
    matched,
    similarity: bestScore,
    conversation,
  };
}

export async function getPatientConversations(patientId: string) {
  return await prisma.conversation.findMany({
    where: { patientId },
    orderBy: { timestamp: 'asc' },
    include: {
      responses: {
        orderBy: { timestamp: 'asc' },
      },
    },
  });
}

export async function sendManualReply(patientId: string, content: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      conversations: {
        orderBy: { timestamp: 'desc' },
        take: 1,
        include: {
          responses: true,
        },
      },
    },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  // Send the manual reply via WhatsApp
  await sendWhatsAppMessage(patient.phoneNumber, content);

  // Create a new response for the most recent conversation
  const lastConversation = patient.conversations[0];
  const newResponse = await prisma.response.create({
    data: {
      conversationId: lastConversation.id,
      content,
      isAutomatic: false,
    },
  });

  // Update patient's last interaction time
  await prisma.patient.update({
    where: { id: patient.id },
    data: {
      lastInteracted: new Date(),
      conversationState: ConversationState.GENERAL_CONVERSATION,
    },
  });

  revalidatePath('/conversations');
  return newResponse;
}

// Settings actions
export async function getSettings() {
  let settings = await prisma.setting.findFirst();

  if (!settings) {
    settings = await prisma.setting.create({
      data: {
        welcomeMessageAr: 'مرحبا بك في عيادة الأسنان. كيف يمكنني مساعدتك؟',
        welcomeMessageFr:
          'Bienvenue à la clinique dentaire. Comment puis-je vous aider?',
        matchThreshold: 0.7,
        autoReplyEnabled: true,
      },
    });
  }

  return settings;
}

export async function updateSettings(data: {
  welcomeMessageAr?: string;
  welcomeMessageFr?: string;
  matchThreshold?: number;
  autoReplyEnabled?: boolean;
}) {
  const current = await getSettings();

  const settings = await prisma.setting.update({
    where: { id: current.id },
    data,
  });

  revalidatePath('/settings');
  return settings;
}

// Stats for dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  const totalPatients = await prisma.patient.count();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const conversationsToday = await prisma.conversation.count({
    where: {
      timestamp: {
        gte: today,
      },
    },
  });

  const totalConversations = await prisma.conversation.count();
  const matchedConversations = await prisma.conversation.count({
    where: {
      matched: true,
    },
  });

  const responseRate =
    totalConversations > 0
      ? Math.round((matchedConversations / totalConversations) * 100)
      : 0;

  const similarityData = await prisma.conversation.aggregate({
    _avg: {
      similarity: true,
    },
    where: {
      matched: true,
    },
  });

  const matchAccuracy = similarityData._avg.similarity
    ? Math.round(similarityData._avg.similarity * 100)
    : 0;

  return {
    totalPatients,
    conversationsToday,
    responseRate,
    matchAccuracy,
  };
}

// Analytics
export async function getMonthlyConversationStats(): Promise<MonthlyStats[]> {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  const conversations = await prisma.conversation.findMany({
    where: {
      timestamp: {
        gte: startDate,
      },
    },
    include: {
      patient: true,
    },
  });

  const monthlyStats = new Map();

  conversations.forEach((conv) => {
    const month = conv.timestamp.toLocaleString('default', { month: 'short' });
    const isArabic = conv.patient.language === 'ARABIC';

    if (!monthlyStats.has(month)) {
      monthlyStats.set(month, { name: month, arabic: 0, french: 0 });
    }

    const stats = monthlyStats.get(month);
    if (isArabic) {
      stats.arabic++;
    } else {
      stats.french++;
    }
  });

  return Array.from(monthlyStats.values());
}

export async function getResponseDistribution(): Promise<
  ResponseDistribution[]
> {
  const total = await prisma.response.count();

  if (total === 0) return [];

  const automatic = await prisma.response.count({
    where: { isAutomatic: true },
  });

  const manual = total - automatic;

  return [
    { name: 'Automatique', value: Math.round((automatic / total) * 100) },
    { name: 'Manuelle', value: Math.round((manual / total) * 100) },
  ];
}
