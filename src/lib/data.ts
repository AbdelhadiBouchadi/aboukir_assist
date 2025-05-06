import { Language } from '@prisma/client';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Users,
  Settings,
  BarChart3,
} from 'lucide-react';

export const MenuDatas = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Conversations',
    path: '/conversations',
    icon: MessageSquare,
  },
  {
    title: 'Script',
    path: '/script',
    icon: FileText,
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: Users,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

export const dashboardStats = [
  {
    title: 'Total Patients',
    value: 342,
    suffix: '',
    change: '+12.3%',
    changeType: 'increase' as const,
    iconName: 'Users',
    color: '#0ea5e9',
  },
  {
    title: 'Conversations Today',
    value: 87,
    suffix: '',
    change: '-5.2%',
    changeType: 'decrease' as const,
    iconName: 'MessageSquare',
    color: '#8b5cf6',
  },
  {
    title: 'Response Rate',
    value: 92,
    suffix: '%',
    change: '+1.8%',
    changeType: 'increase' as const,
    iconName: 'CheckCircle2',
    color: '#10b981',
  },
  {
    title: 'Match Accuracy',
    value: 85,
    suffix: '%',
    change: '+2.5%',
    changeType: 'increase' as const,
    iconName: 'Target',
    color: '#f59e0b',
  },
];

export const monthlyConversationStats = [
  { name: 'Jan', arabic: 45, french: 78 },
  { name: 'Feb', arabic: 52, french: 85 },
  { name: 'Mar', arabic: 61, french: 92 },
  { name: 'Apr', arabic: 48, french: 88 },
  { name: 'May', arabic: 55, french: 95 },
  { name: 'Jun', arabic: 67, french: 103 },
];

export const responseDistribution = [
  { name: 'Matched', value: 75 },
  { name: 'Manual', value: 15 },
  { name: 'Unmatched', value: 10 },
];

export const demoScriptData = [
  {
    id: '1',
    questionAr: 'ما هي ساعات عمل العيادة؟',
    questionFr: "Quelles sont les heures d'ouverture de la clinique?",
    responseAr:
      'ساعات عملنا هي من الاثنين إلى الجمعة من الساعة 9 صباحًا حتى 6 مساءً، والسبت من الساعة 10 صباحًا حتى 4 مساءً، والأحد مغلق.',
    responseFr:
      "Nos heures d'ouverture sont du lundi au vendredi de 9h à 18h, le samedi de 10h à 16h, et fermé le dimanche.",
    keywords: ['heures', 'ouverture', 'horaires', 'ساعات', 'العمل', 'مفتوح'],
    category: 'General',
    active: true,
  },
  {
    id: '2',
    questionAr: 'كم تكلفة تنظيف الأسنان؟',
    questionFr: "Quel est le coût d'un nettoyage dentaire?",
    responseAr:
      'تكلفة تنظيف الأسنان الأساسي تبدأ من 80 دولارًا. يمكن أن تختلف التكلفة بناءً على متطلباتك الفردية. يرجى الاتصال بنا أو زيارتنا لمزيد من المعلومات.',
    responseFr:
      "Le coût d'un nettoyage dentaire de base commence à 80€. Le coût peut varier en fonction de vos besoins individuels. Veuillez nous appeler ou nous visiter pour plus d'informations.",
    keywords: ['coût', 'prix', 'nettoyage', 'تكلفة', 'سعر', 'تنظيف'],
    category: 'Pricing',
    active: true,
  },
  {
    id: '3',
    questionAr: 'هل تقبلون التأمين الصحي؟',
    questionFr: "Acceptez-vous l'assurance maladie?",
    responseAr:
      'نعم، نقبل معظم شركات التأمين الصحي الرئيسية. يرجى إحضار بطاقة التأمين الخاصة بك في زيارتك الأولى.',
    responseFr:
      "Oui, nous acceptons la plupart des assurances maladies principales. Veuillez apporter votre carte d'assurance lors de votre première visite.",
    keywords: ['assurance', 'couverture', 'تأمين', 'تغطية'],
    category: 'Insurance',
    active: true,
  },
  {
    id: '4',
    questionAr: 'كيف يمكنني حجز موعد؟',
    questionFr: 'Comment puis-je prendre rendez-vous?',
    responseAr:
      'يمكنك حجز موعد عن طريق الاتصال بنا على الرقم 123-456-789 أو عبر موقعنا الإلكتروني.',
    responseFr:
      'Vous pouvez prendre rendez-vous en nous appelant au 123-456-789 ou via notre site web.',
    keywords: ['rendez-vous', 'réserver', 'موعد', 'حجز'],
    category: 'Appointments',
    active: true,
  },
];

export const demoPatientData = [
  {
    id: '1',
    phoneNumber: '+33612345678',
    name: 'Sophie Martin',
    language: 'FRENCH' as Language,
    lastInteracted: new Date('2024-03-20T16:45:00Z'),
    _count: {
      conversations: 12,
    },
  },
  {
    id: '2',
    phoneNumber: '+212612345678',
    name: 'أحمد المغربي',
    language: 'ARABIC' as Language,
    lastInteracted: new Date('2024-03-20T16:45:00Z'),
    _count: {
      conversations: 12,
    },
  },
  {
    id: '3',
    phoneNumber: '+33623456789',
    name: 'Jean Dupont',
    language: 'FRENCH' as Language,
    lastInteracted: new Date('2024-03-20T16:45:00Z'),
    _count: {
      conversations: 12,
    },
  },
];

export const demoConversations = [
  {
    id: '1',
    patient: {
      id: '1',
      name: 'Sophie Martin',
      createdAt: new Date('2024-03-20T16:45:00Z'),
      updatedAt: new Date('2024-03-20T16:45:00Z'),
      phoneNumber: '+33612345678',
      language: 'FRENCH' as Language,
      lastInteracted: new Date('2024-03-20T14:30:00Z'),
    },
    messageContent: "Quelles sont vos heures d'ouverture?",
    language: 'FRENCH' as Language,
    matched: true,
    timestamp: new Date('2024-03-20T14:30:00Z'),
  },
  {
    id: '2',
    patient: {
      id: '2',
      name: 'أحمد المغربي',
      createdAt: new Date('2024-03-20T16:45:00Z'),
      updatedAt: new Date('2024-03-20T16:45:00Z'),
      phoneNumber: '+212612345678',
      language: 'ARABIC' as Language,
      lastInteracted: new Date('2024-03-20T15:45:00Z'),
    },
    messageContent: 'كم تكلفة تنظيف الأسنان؟',
    language: 'ARABIC' as Language,
    matched: true,
    timestamp: new Date('2024-03-20T15:45:00Z'),
  },
  {
    id: '3',
    patient: {
      id: '3',
      name: 'Jean Dupont',
      createdAt: new Date('2024-03-20T16:45:00Z'),
      updatedAt: new Date('2024-03-20T16:45:00Z'),
      phoneNumber: '+33623456789',
      language: 'FRENCH' as Language,
      lastInteracted: new Date('2024-03-20T16:15:00Z'),
    },
    messageContent: "Acceptez-vous l'assurance maladie?",
    language: 'FRENCH' as Language,
    matched: false,
    timestamp: new Date('2024-03-20T16:15:00Z'),
  },
  {
    id: '4',
    patient: {
      id: '1',
      name: 'Sophie Martin',
      createdAt: new Date('2024-03-20T16:45:00Z'),
      updatedAt: new Date('2024-03-20T16:45:00Z'),
      phoneNumber: '+33612345678',
      language: 'FRENCH' as Language,
      lastInteracted: new Date('2024-03-20T16:45:00Z'),
    },
    messageContent: 'Comment puis-je prendre rendez-vous?',
    language: 'FRENCH' as Language,
    matched: true,
    timestamp: new Date('2024-03-20T16:45:00Z'),
  },
  {
    id: '5',
    patient: {
      id: '2',
      name: 'أحمد المغربي',
      createdAt: new Date('2024-03-20T16:45:00Z'),
      updatedAt: new Date('2024-03-20T16:45:00Z'),
      phoneNumber: '+212612345678',
      language: 'ARABIC' as Language,
      lastInteracted: new Date('2024-03-20T17:00:00Z'),
    },
    messageContent: 'هل تقبلون التأمين الصحي؟',
    language: 'ARABIC' as Language,
    matched: true,
    timestamp: new Date('2024-03-20T17:00:00Z'),
  },
];
