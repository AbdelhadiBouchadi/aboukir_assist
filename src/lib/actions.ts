'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import stringSimilarity from 'string-similarity';
import { sendWhatsAppMessage } from './whatsapp';

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
  const script = await prisma.script.create({
    data: {
      questionAr: data.questionAr,
      questionFr: data.questionFr,
      responseAr: data.responseAr,
      responseFr: data.responseFr,
      keywords: data.keywords || [],
      category: data.category,
      active: data.active !== undefined ? data.active : true,
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
  const script = await prisma.script.update({
    where: { id },
    data,
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
        include: { script: true },
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
    },
  });

  revalidatePath('/patients');
  return patient;
}

// Conversation actions
export async function getConversations() {
  return await prisma.conversation.findMany({
    include: {
      patient: true,
      script: true,
    },
    orderBy: { timestamp: 'desc' },
  });
}

export async function processMessage(
  phoneNumber: string,
  message: string,
  language: 'ARABIC' | 'FRENCH' = 'FRENCH'
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
      },
    });

    // Send welcome message
    const settings = await getSettings();
    const welcomeMessage =
      language === 'ARABIC'
        ? settings.welcomeMessageAr
        : settings.welcomeMessageFr;

    await sendWhatsAppMessage(phoneNumber, welcomeMessage);
  }

  // Find the best matching script
  const scripts = await prisma.script.findMany({
    where: { active: true },
  });

  let bestMatch = null;
  let bestScore = 0;
  let isArabic = language === 'ARABIC';

  // Compare message with questions in appropriate language
  for (const script of scripts) {
    const compareText = isArabic ? script.questionAr : script.questionFr;
    const similarity = stringSimilarity.compareTwoStrings(
      message.toLowerCase(),
      compareText.toLowerCase()
    );

    // Also check if any keywords are present
    let keywordBoost = 0;
    if (script.keywords && script.keywords.length > 0) {
      const messageWords = message.toLowerCase().split(/\s+/);
      for (const keyword of script.keywords) {
        if (messageWords.includes(keyword.toLowerCase())) {
          keywordBoost += 0.1; // Add a small boost for each matched keyword
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
  const response = matched
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
      response,
      matched,
      similarity: bestScore,
    },
  });

  // Update patient last interaction
  await prisma.patient.update({
    where: { id: patient.id },
    data: {
      lastInteracted: new Date(),
      language: isArabic ? 'ARABIC' : 'FRENCH',
    },
  });

  revalidatePath('/conversations');
  revalidatePath('/patients');
  revalidatePath('/dashboard');

  return {
    response,
    matched,
    similarity: bestScore,
    conversation,
  };
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
export async function getDashboardStats() {
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
export async function getMonthlyConversationStats() {
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

export async function getResponseDistribution() {
  const total = await prisma.conversation.count();

  if (total === 0) return [];

  const matched = await prisma.conversation.count({
    where: { matched: true },
  });

  const manual = await prisma.conversation.count({
    where: {
      matched: false,
      response: {
        notIn: [
          'عذرًا، لم أفهم سؤالك. هل يمكنك إعادة صياغته؟',
          "Désolé, je n'ai pas compris votre question. Pouvez-vous la reformuler?",
        ],
      },
    },
  });

  const unmatched = total - matched - manual;

  return [
    { name: 'Matched', value: Math.round((matched / total) * 100) },
    { name: 'Manual', value: Math.round((manual / total) * 100) },
    { name: 'Unmatched', value: Math.round((unmatched / total) * 100) },
  ];
}
