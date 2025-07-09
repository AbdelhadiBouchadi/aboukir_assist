import { ServiceOption } from '../types';

// Dental services available for selection
export const DENTAL_SERVICES: ServiceOption[] = [
  {
    id: 'teeth_whitening',
    nameAr: 'تبييض الأسنان',
    nameFr: 'Blanchiment dentaire',
    responseAr:
      '✅ نعم، نقوم بـتبييض الأسنان في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons le blanchiment dentaire au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
  {
    id: 'dental_implant',
    nameAr: 'زراعة الأسنان',
    nameFr: 'Implant dentaire',
    responseAr:
      '✅ نعم، نقوم بـزراعة الأسنان في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons les implants dentaires au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
  {
    id: 'composite',
    nameAr: 'حشو الأسنان (كومبوزيت)',
    nameFr: 'Composite / Carie',
    responseAr:
      '✅ نعم، نقوم بـحشو الأسنان (كومبوزيت) في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons les composites et traitements des caries au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
  {
    id: 'root_canal',
    nameAr: 'علاج العصب',
    nameFr: 'Traitement canalaire',
    responseAr:
      '✅ نعم، نقوم بـعلاج العصب في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons le traitement canalaire au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
  {
    id: 'extraction',
    nameAr: 'قلع الأسنان',
    nameFr: 'Extraction de dent',
    responseAr:
      '✅ نعم، نقوم بـقلع الأسنان في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons les extractions dentaires au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
  {
    id: 'crown',
    nameAr: 'تركيب الأسنان الثابتة',
    nameFr: 'Couronne CCM/Zircon',
    responseAr:
      '✅ نعم، نقوم بـتركيب الأسنان الثابتة في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons les couronnes CCM et Zircon au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
  {
    id: 'denture',
    nameAr: 'تركيبات متحركة',
    nameFr: 'Prothèse amovible',
    responseAr:
      '✅ نعم، نقوم بـتركيبات متحركة في العيادة.\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
    responseFr:
      '✅ Oui, nous faisons les prothèses amovibles au cabinet.\n📍 Adresse : Ait Amira, au-dessus de Qissariat Assafi, 1er étage\n📞 Téléphone : 0783 74 52 47',
  },
];

// Response templates
export const RESPONSES = {
  appointmentYes: {
    fr: '🕒 Parfait !\nNous allons vous appeler le plus tôt possible 📞\nVous pouvez aussi venir directement :\n🗓 Du lundi au vendredi de 9h à 19h\n🗓 Le samedi de 9h à 14h\n📍 Adresse : Ait Amira, 1er étage au-dessus de Qissariat Assafi\n📞 Téléphone : 0783 74 52 47',
    ar: '🕒 ممتاز!\nسنتصل بك في أقرب وقت ممكن 📞\nيمكنك أيضًا الحضور مباشرة:\n🗓 من الإثنين إلى الجمعة من 9 صباحًا إلى 7 مساءً\n🗓 السبت من 9 صباحًا إلى 2 ظهرًا\n📍 العنوان: أيت عميرة، فوق قيسارية آسفي، الطابق الأول\n📞 الهاتف: 0783 74 52 47',
  },
  appointmentNo: {
    fr: "Pas de souci 😊\nSi vous avez des questions, n'hésitez pas à nous écrire ici à tout moment.\n📍 Centre Dentaire Ait Amira\n📞 0783 74 52 47\n🕒 Lundi–Vendredi: 9h–19h, Samedi: 9h–14h",
    ar: 'لا بأس 😊\nإذا كانت لديك أسئلة، لا تتردد في مراسلتنا هنا في أي وقت.\n📍 مركز أيت عميرة لطب الأسنان\n📞 0783 74 52 47\n🕒 الإثنين-الجمعة: 9 صباحًا-7 مساءً، السبت: 9 صباحًا-2 ظهرًا',
  },
  serviceMenu: {
    fr: 'Quel acte souhaitez-vous faire ? Choisissez une option ci-dessous 👇\n1️⃣ Blanchiment dentaire\n2️⃣ Implant dentaire\n3️⃣ Composite / Carie\n4️⃣ Traitement canalaire\n5️⃣ Extraction de dent\n6️⃣ Couronne CCM/Zircon\n7️⃣ Prothèse amovible',
    ar: 'ما نوع الخدمة التي تحتاجها؟ اختر واحدة 👇\n1️⃣ تبييض الأسنان\n2️⃣ زراعة الأسنان\n3️⃣ حشو الأسنان (كومبوزيت)\n4️⃣ علاج العصب\n5️⃣ قلع الأسنان\n6️⃣ تركيب الأسنان الثابتة\n7️⃣ تركيبات متحركة',
  },
  appointmentQuestion: {
    fr: '📆 Souhaitez-vous réserver un rendez-vous ?',
    ar: '📆 هل ترغب في حجز موعد؟',
  },
  welcome: {
    message:
      '👋 مرحباً بك في مركز طب الأسنان ابوكير!\nهل تود المتابعة بـ :\n🇫🇷 الفرنسية\n🇲🇦 العربية',
  },
};

// Get a dental service by its number (1-7)
export function getDentalServiceByNumber(number: number): ServiceOption | null {
  if (number >= 1 && number <= DENTAL_SERVICES.length) {
    return DENTAL_SERVICES[number - 1];
  }
  return null;
}

// Get service by numeric text (e.g., "1", "1️⃣", etc.)
export function getServiceByNumericText(text: string): ServiceOption | null {
  // Clean the text to extract just the number
  const cleanedText = text.trim();

  // Check if it's a numeric emoji (1️⃣, 2️⃣, etc.)
  if (cleanedText.includes('1️⃣')) return DENTAL_SERVICES[0];
  if (cleanedText.includes('2️⃣')) return DENTAL_SERVICES[1];
  if (cleanedText.includes('3️⃣')) return DENTAL_SERVICES[2];
  if (cleanedText.includes('4️⃣')) return DENTAL_SERVICES[3];
  if (cleanedText.includes('5️⃣')) return DENTAL_SERVICES[4];
  if (cleanedText.includes('6️⃣')) return DENTAL_SERVICES[5];
  if (cleanedText.includes('7️⃣')) return DENTAL_SERVICES[6];

  // Check if it's just a number
  if (/^[1-7]$/.test(cleanedText)) {
    const number = parseInt(cleanedText);
    return getDentalServiceByNumber(number);
  }

  // Check service names in both languages
  return (
    DENTAL_SERVICES.find(
      (service) =>
        service.nameAr.includes(cleanedText) ||
        service.nameFr.toLowerCase().includes(cleanedText.toLowerCase())
    ) || null
  );
}
