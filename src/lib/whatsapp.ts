'use server';

import {
  getPatientLanguage,
  getSettings,
  processMessage,
  updatePatientLanguage,
} from './actions';

const WHATSAPP_PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
const WHATSAPP_BUSINESS_ID = process.env.WHATSAPP_BUSINESS_ID;
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER}/messages`;

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    console.log('Sending message:', { to, message });

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error response:', error);
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('WhatsApp API success:', result);
    return result;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

export async function sendLanguageSelectionMessage(
  to: string,
  welcomeMessage: string
) {
  try {
    console.log('Sending language selection message:', { to, welcomeMessage });

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: welcomeMessage,
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'lang_fr',
                  title: 'Français',
                },
              },
              {
                type: 'reply',
                reply: {
                  id: 'lang_ar',
                  title: 'العربية',
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API error response:', error);
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('WhatsApp language selection success:', result);
    return result;
  } catch (error) {
    console.error('Error sending language selection message:', error);
    throw error;
  }
}

export async function verifyWhatsAppWebhook(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('Verifying webhook:', { mode, token });

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new Response(challenge, { status: 200 });
  }

  console.log('Webhook verification failed');
  return new Response('Forbidden', { status: 403 });
}

export async function handleWhatsAppWebhook(req: Request) {
  try {
    const body = await req.json();
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    // Handle test webhook payload
    if (body.field === 'messages' && body.value?.messages) {
      console.log('Processing test webhook');
      for (const message of body.value.messages) {
        await processIncomingMessage(message, body.value);
      }
      return new Response('OK', { status: 200 });
    }

    // Handle real webhook from WhatsApp
    if (body.object === 'whatsapp_business_account') {
      console.log('Processing business account webhook');
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value?.messages) {
            for (const message of change.value.messages) {
              await processIncomingMessage(message, change.value);
            }
          }
        }
      }
      return new Response('OK', { status: 200 });
    }

    console.log('Invalid webhook payload');
    return new Response('Bad Request', { status: 400 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function processIncomingMessage(message: any, value: any) {
  try {
    const phoneNumber = message.from;
    const name = value.contacts?.[0]?.profile?.name;

    // Handle interactive responses (button clicks)
    if (message.type === 'interactive' && message.interactive?.button_reply) {
      const buttonId = message.interactive.button_reply.id;

      if (buttonId === 'lang_fr') {
        await updatePatientLanguage(phoneNumber, 'FRENCH', name);
        await sendWhatsAppMessage(
          phoneNumber,
          "Merci d'avoir choisi le français. Comment puis-je vous aider aujourd'hui ?"
        );
        return;
      } else if (buttonId === 'lang_ar') {
        await updatePatientLanguage(phoneNumber, 'ARABIC', name);
        await sendWhatsAppMessage(
          phoneNumber,
          'شكراً لاختيارك اللغة العربية. كيف يمكنني مساعدتك اليوم؟'
        );
        return;
      }
    }

    // 🔐 NEW: Check if the user has selected a language yet
    const patientLang = await getPatientLanguage(phoneNumber);
    if (!patientLang) {
      // Send only once
      await sendLanguageSelectionMessage(
        phoneNumber,
        'Bienvenue au centre dentaire Aboukir. Veuillez choisir votre langue / مرحباً بكم في مركز أبو كير لطب و جراحة الأسنان. الرجاء اختيار اللغة الخاصة بكم'
      );
      return; // prevent any further message processing until language is selected
    }

    // Process regular text messages
    if (message.type === 'text') {
      const messageContent = message.text?.body;
      if (!messageContent) return;

      const response = await processMessage(
        phoneNumber,
        messageContent,
        patientLang === 'ARABIC' ? 'ARABIC' : 'FRENCH',
        name
      );

      await sendWhatsAppMessage(phoneNumber, response.response);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
}
